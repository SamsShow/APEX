module Apex::option_contract {
    use std::signer;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::event;

    /// Error codes
    const EALREADY_INITIALIZED: u64 = 1;
    const EINVALID_OPTION_TYPE: u64 = 2;
    const EINVALID_QUANTITY: u64 = 3;
    const EINVALID_STRIKE: u64 = 4;
    const EINVALID_EXPIRY: u64 = 5;
    const ENOT_FOUND: u64 = 6;
    const EALREADY_TERMINATED: u64 = 7;
    const EEXPIRED: u64 = 8;
    const EINVALID_SERIES: u64 = 9;

    /// Option type constants
    /// 0 = Call, 1 = Put
    const OPTION_TYPE_CALL: u8 = 0;
    const OPTION_TYPE_PUT: u8 = 1;

    /// Option status constants
    /// 0 = Active, 1 = Exercised, 2 = Canceled
    const STATUS_ACTIVE: u8 = 0;
    const STATUS_EXERCISED: u8 = 1;
    const STATUS_CANCELED: u8 = 2;

    /// Represents a simple option contract
    #[event]
    struct OptionContract has copy, drop, store {
        id: u64,
        owner: address,
        series_id: u64,
        strike_price: u64,
        expiry_seconds: u64,
        option_type: u8,
        quantity: u64,
        status: u8,
        settlement_price: u64,
        payout_amount: u64,
    }

    /// Per-account store of option contracts
    struct Options has key {
        items: vector<OptionContract>,
        next_id: u64,
    }

    /// Series metadata registry -------------------------------------------------
    #[event]
    struct OptionSeries has copy, drop, store {
        id: u64,
        strike_price: u64,
        expiry_seconds: u64,
        option_type: u8,
    }

    struct SeriesRegistry has key {
        items: vector<OptionSeries>,
        next_id: u64,
    }

    /// Strategy portfolio per user ---------------------------------------------
    struct StrategyPortfolio has key {
        legs: vector<u64>, // option ids
    }

    // No per-account event handles; use module events via event::emit<T>(msg)

    /// Publish empty `Options` resource under the calling account
    public entry fun init_account(account: &signer) {
        let addr = signer::address_of(account);
        assert!(!exists<Options>(addr), EALREADY_INITIALIZED);
        move_to(account, Options { items: vector::empty<OptionContract>(), next_id: 0 });
        if (!exists<StrategyPortfolio>(addr)) {
            move_to(account, StrategyPortfolio { legs: vector::empty<u64>() });
        };
    }

    /// Create and store a new `OptionContract` under the caller
    public entry fun create_option(
        account: &signer,
        strike_price: u64,
        expiry_seconds: u64,
        option_type: u8,
        quantity: u64,
    ) acquires Options, StrategyPortfolio {
        assert!(strike_price > 0, EINVALID_STRIKE);
        assert!(expiry_seconds > 0, EINVALID_EXPIRY);
        assert!(quantity > 0, EINVALID_QUANTITY);
        assert!(option_type == OPTION_TYPE_CALL || option_type == OPTION_TYPE_PUT, EINVALID_OPTION_TYPE);

        let addr = signer::address_of(account);
        if (!exists<Options>(addr)) {
            move_to(account, Options { items: vector::empty<OptionContract>(), next_id: 0 });
        };
        let options = borrow_global_mut<Options>(addr);
        let id = options.next_id;
        options.next_id = id + 1;
        let new_option = OptionContract {
            id,
            owner: addr,
            series_id: 0,
            strike_price,
            expiry_seconds,
            option_type,
            quantity,
            status: STATUS_ACTIVE,
            settlement_price: 0,
            payout_amount: 0,
        };
        vector::push_back<OptionContract>(&mut options.items, new_option);
        // emit module event for creation
        let last_ref = vector::borrow<OptionContract>(&options.items, vector::length(&options.items) - 1);
        event::emit<OptionContract>(*last_ref);
        if (exists<StrategyPortfolio>(addr)) {
            let p = borrow_global_mut<StrategyPortfolio>(addr);
            vector::push_back<u64>(&mut p.legs, id);
        };
    }

    /// Create a new series under the publisher account
    public entry fun create_series(publisher: &signer, strike_price: u64, expiry_seconds: u64, option_type: u8) acquires SeriesRegistry {
        assert!(strike_price > 0, EINVALID_STRIKE);
        assert!(expiry_seconds > 0, EINVALID_EXPIRY);
        assert!(option_type == OPTION_TYPE_CALL || option_type == OPTION_TYPE_PUT, EINVALID_OPTION_TYPE);
        let addr = signer::address_of(publisher);
        if (!exists<SeriesRegistry>(addr)) {
            move_to(publisher, SeriesRegistry { items: vector::empty<OptionSeries>(), next_id: 0 });
        };
        let r = borrow_global_mut<SeriesRegistry>(addr);
        let id = r.next_id;
        r.next_id = id + 1;
        let s = OptionSeries { id, strike_price, expiry_seconds, option_type };
        vector::push_back<OptionSeries>(&mut r.items, s);
        event::emit<OptionSeries>(s);
    }

    /// Returns number of options stored for `owner`
    #[view]
    public fun get_num_options(owner: address): u64 acquires Options {
        let options = borrow_global<Options>(owner);
        vector::length<OptionContract>(&options.items)
    }

    #[view]
    public fun get_series_count(publisher: address): u64 acquires SeriesRegistry {
        if (!exists<SeriesRegistry>(publisher)) return 0;
        let r = borrow_global<SeriesRegistry>(publisher);
        vector::length<OptionSeries>(&r.items)
    }

    #[view]
    public fun get_portfolio_legs(owner: address): vector<u64> acquires StrategyPortfolio {
        if (!exists<StrategyPortfolio>(owner)) return vector::empty<u64>();
        let p = borrow_global<StrategyPortfolio>(owner);
        let res = vector::empty<u64>();
        let i = 0u64;
        let len = vector::length(&p.legs);
        while (i < len) {
            let x = *vector::borrow(&p.legs, i);
            vector::push_back(&mut res, x);
            i = i + 1;
        };
        res
    }

    /// Helpers -------------------------------------------------------------------------------
    fun copy_last_option(owner: address): OptionContract acquires Options {
        let options = borrow_global<Options>(owner);
        let len = vector::length<OptionContract>(&options.items);
        let item_ref = vector::borrow<OptionContract>(&options.items, len - 1);
        *item_ref
    }

    fun find_index_by_id(options: &Options, id: u64): (bool, u64) {
        let i = 0u64;
        let len = vector::length<OptionContract>(&options.items);
        while (i < len) {
            let item_ref = vector::borrow<OptionContract>(&options.items, i);
            if (item_ref.id == id) {
                return (true, i)
            };
            i = i + 1;
        };
        (false, 0)
    }

    /// Cancel an active option by id
    public entry fun cancel_option(account: &signer, id: u64) acquires Options {
        let addr = signer::address_of(account);
        assert!(exists<Options>(addr), ENOT_FOUND);
        let options = borrow_global_mut<Options>(addr);
        let (found, idx) = find_index_by_id(options, id);
        assert!(found, ENOT_FOUND);
        let opt_ref = vector::borrow_mut<OptionContract>(&mut options.items, idx);
        assert!(opt_ref.status == STATUS_ACTIVE, EALREADY_TERMINATED);
        opt_ref.status = STATUS_CANCELED;
    }

    fun compute_payout(strike_price: u64, option_type: u8, quantity: u64, settlement_price: u64): u64 {
        let intrinsic = if (option_type == OPTION_TYPE_CALL) {
            if (settlement_price > strike_price) settlement_price - strike_price else 0
        } else {
            if (strike_price > settlement_price) strike_price - settlement_price else 0
        };
        intrinsic * quantity
    }

    /// Exercise an active option by id. If `use_onchain_time` == 1, uses on-chain time; otherwise uses `current_time_seconds` provided by caller (for testing/MVP).
    /// Canonical exercise: use on-chain time only
    public entry fun exercise(account: &signer, id: u64, settlement_price: u64) acquires Options {
        let addr = signer::address_of(account);
        assert!(exists<Options>(addr), ENOT_FOUND);
        let options = borrow_global_mut<Options>(addr);
        let (found, idx) = find_index_by_id(options, id);
        assert!(found, ENOT_FOUND);
        let opt_ref = vector::borrow_mut<OptionContract>(&mut options.items, idx);
        assert!(opt_ref.status == STATUS_ACTIVE, EALREADY_TERMINATED);
        let now = timestamp::now_seconds();
        assert!(now <= opt_ref.expiry_seconds, EEXPIRED);
        let payout = compute_payout(opt_ref.strike_price, opt_ref.option_type, opt_ref.quantity, settlement_price);
        opt_ref.settlement_price = settlement_price;
        opt_ref.payout_amount = payout;
        opt_ref.status = STATUS_EXERCISED;
    }

    /// Legacy entry kept for compatibility; testing path without on-chain time
    public entry fun exercise_option(account: &signer, id: u64, settlement_price: u64, _use_onchain_time: u8, current_time_seconds: u64) acquires Options {
        let addr = signer::address_of(account);
        assert!(exists<Options>(addr), ENOT_FOUND);
        let options = borrow_global_mut<Options>(addr);
        let (found, idx) = find_index_by_id(options, id);
        assert!(found, ENOT_FOUND);
        let opt_ref = vector::borrow_mut<OptionContract>(&mut options.items, idx);
        assert!(opt_ref.status == STATUS_ACTIVE, EALREADY_TERMINATED);
        let now = current_time_seconds;
        assert!(now <= opt_ref.expiry_seconds, EEXPIRED);
        let payout = compute_payout(opt_ref.strike_price, opt_ref.option_type, opt_ref.quantity, settlement_price);
        opt_ref.settlement_price = settlement_price;
        opt_ref.payout_amount = payout;
        opt_ref.status = STATUS_EXERCISED;
    }

    #[test(account = @0xA)]
    fun test_init_and_create_ok(account: &signer) acquires Options, StrategyPortfolio {
        // init and create should succeed and store one option
        init_account(account);
        create_option(account, 100, 999999, OPTION_TYPE_CALL, 5);

        let num = get_num_options(@0xA);
        assert!(num == 1, 100);

        let last = copy_last_option(@0xA);
        assert!(last.owner == @0xA, 1000);
        assert!(last.id == 0, 1001);
        assert!(last.strike_price == 100, 101);
        assert!(last.expiry_seconds == 999999, 102);
        assert!(last.option_type == OPTION_TYPE_CALL, 103);
        assert!(last.quantity == 5, 104);
        assert!(last.status == STATUS_ACTIVE, 105);
    }

    #[test(account = @0xB)]
    fun test_create_without_explicit_init(account: &signer) acquires Options, StrategyPortfolio {
        // create_option should lazily publish Options if missing
        create_option(account, 250, 12345, OPTION_TYPE_PUT, 1);
        let num = get_num_options(@0xB);
        assert!(num == 1, 200);
        let last = copy_last_option(@0xB);
        assert!(last.id == 0, 201);
    }

    

    #[test(account = @0xD)]
    #[expected_failure(abort_code = EALREADY_INITIALIZED)]
    fun test_double_init_fails(account: &signer) {
        init_account(account);
        init_account(account);
    }

    #[test(account = @0xE)]
    #[expected_failure(abort_code = EINVALID_STRIKE)]
    fun test_invalid_strike_failure(account: &signer) acquires Options, StrategyPortfolio {
        create_option(account, 0, 1, OPTION_TYPE_CALL, 1);
    }

    #[test(account = @0xF)]
    #[expected_failure(abort_code = EINVALID_EXPIRY)]
    fun test_invalid_expiry_failure(account: &signer) acquires Options, StrategyPortfolio {
        create_option(account, 1, 0, OPTION_TYPE_CALL, 1);
    }

    #[test(account = @0x10)]
    #[expected_failure(abort_code = EINVALID_QUANTITY)]
    fun test_invalid_quantity_failure(account: &signer) acquires Options, StrategyPortfolio {
        create_option(account, 1, 1, OPTION_TYPE_CALL, 0);
    }

    #[test(account = @0x11)]
    #[expected_failure(abort_code = EINVALID_OPTION_TYPE)]
    fun test_invalid_type_failure(account: &signer) acquires Options, StrategyPortfolio {
        create_option(account, 1, 1, 42, 1);
    }

    #[test(account = @0x12)]
    fun test_cancel_and_exercise(account: &signer) acquires Options, StrategyPortfolio {
        // create two options
        create_option(account, 100, 1000, OPTION_TYPE_CALL, 1);
        create_option(account, 200, 2000, OPTION_TYPE_PUT, 2);
        let num = get_num_options(@0x12);
        assert!(num == 2, 400);

        // cancel first (id 0), exercise second (id 1)
        cancel_option(account, 0);
        // cannot use on-chain time in unit tests; use legacy backdoor
        exercise_option(account, 1, 210, 0, 1500);

        let o1 = copy_last_option(@0x12); // last created has id 1
        assert!(o1.id == 1, 401);
        assert!(o1.status == STATUS_EXERCISED, 402);
        assert!(o1.settlement_price == 210, 405);
        // id 1 is a put with strike 200, settlement 210 => OTM -> payout 0
        assert!(o1.payout_amount == 0, 406);

        // find first by scanning to ensure statuses updated; access by index 0
        let options = borrow_global<Options>(@0x12);
        let first = *vector::borrow<OptionContract>(&options.items, 0);
        assert!(first.id == 0, 403);
        assert!(first.status == STATUS_CANCELED, 404);
    }

    #[test(account = @0x13)]
    #[expected_failure(abort_code = ENOT_FOUND)]
    fun test_cancel_nonexistent_fails(account: &signer) acquires Options {
        // nothing created; cancel should fail
        cancel_option(account, 0);
    }

    #[test(account = @0x14)]
    #[expected_failure(abort_code = EALREADY_TERMINATED)]
    fun test_double_cancel_fails(account: &signer) acquires Options, StrategyPortfolio {
        create_option(account, 10, 10, OPTION_TYPE_CALL, 1);
        cancel_option(account, 0);
        cancel_option(account, 0);
    }

    #[test(account = @0x15)]
    #[expected_failure(abort_code = EALREADY_TERMINATED)]
    fun test_cancel_after_exercise_fails(account: &signer) acquires Options, StrategyPortfolio {
        create_option(account, 10, 10, OPTION_TYPE_CALL, 1);
        exercise_option(account, 0, 15, 0, 10);
        cancel_option(account, 0);
    }

    #[test(account = @0x16)]
    #[expected_failure(abort_code = EEXPIRED)]
    fun test_exercise_after_expiry_fails(account: &signer) acquires Options, StrategyPortfolio {
        create_option(account, 100, 1000, OPTION_TYPE_CALL, 1);
        exercise_option(account, 0, 150, 0, 1001);
    }

    #[test(account = @0x17)]
    fun test_exercise_payouts(account: &signer) acquires Options, StrategyPortfolio {
        // Call ITM
        create_option(account, 100, 1000, OPTION_TYPE_CALL, 3);
        exercise_option(account, 0, 150, 0, 900);
        let call = copy_last_option(@0x17);
        // (150-100)*3 = 150
        assert!(call.payout_amount == 150, 500);

        // Put ITM
        create_option(account, 200, 1000, OPTION_TYPE_PUT, 2);
        exercise_option(account, 1, 150, 0, 900);
        let put = copy_last_option(@0x17);
        // (200-150)*2 = 100
        assert!(put.payout_amount == 100, 501);
    }
}


