import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';
import {
  OptionContract,
  OptionSeries,
  StrategyLeg,
  ContractConfig,
  OPTION_TYPE_CALL,
  OPTION_TYPE_PUT,
  CONTRACT_ERRORS,
} from './types';

// Contract configuration - Deployed on Aptos testnet
export const APEX_CONTRACT_CONFIG: ContractConfig = {
  address: '0x9840325ffef7ffc5de961625fd9909d916eecd4fa515ddb2fdf4b38f47f5b083', // Deployed contract address
  module: 'option_contract',
};

// Initialize Aptos client
const aptosConfig = new AptosConfig({
  network: Network.TESTNET,
});
export const aptos = new Aptos(aptosConfig);

export class ApexOptionsContract {
  private contractAddress: string;
  private moduleName: string;

  constructor(config: ContractConfig = APEX_CONTRACT_CONFIG) {
    this.contractAddress = config.address;
    this.moduleName = config.module;
  }

  /**
   * Initialize user account with Options and StrategyPortfolio resources
   */
  async initAccount(account: Account): Promise<string> {
    const transaction = await aptos.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        function: `${this.contractAddress}::${this.moduleName}::init_account` as any,
        typeArguments: [],
        functionArguments: [],
      },
    });

    try {
      const txn = await aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      return txn.hash;
    } catch (error) {
      console.error('Failed to initialize account:', error);
      throw error;
    }
  }

  /**
   * Create a new option contract
   */
  async createOption(
    account: Account,
    strikePrice: number,
    expirySeconds: number,
    optionType: 'call' | 'put',
    quantity: number,
  ): Promise<string> {
    const optionTypeValue = optionType === 'call' ? OPTION_TYPE_CALL : OPTION_TYPE_PUT;

    const transaction = await aptos.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        function: `${this.contractAddress}::${this.moduleName}::create_option` as any,
        typeArguments: [],
        functionArguments: [strikePrice, expirySeconds, optionTypeValue, quantity],
      },
    });

    try {
      const txn = await aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      return txn.hash;
    } catch (error) {
      console.error('Failed to create option:', error);
      throw error;
    }
  }

  /**
   * Create an option series
   */
  async createSeries(
    account: Account,
    strikePrice: number,
    expirySeconds: number,
    optionType: 'call' | 'put',
  ): Promise<string> {
    const optionTypeValue = optionType === 'call' ? OPTION_TYPE_CALL : OPTION_TYPE_PUT;

    const transaction = await aptos.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        function: `${this.contractAddress}::${this.moduleName}::create_series` as any,
        typeArguments: [],
        functionArguments: [strikePrice, expirySeconds, optionTypeValue],
      },
    });

    try {
      const txn = await aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      return txn.hash;
    } catch (error) {
      console.error('Failed to create series:', error);
      throw error;
    }
  }

  /**
   * Cancel an active option
   */
  async cancelOption(account: Account, optionId: number): Promise<string> {
    const transaction = await aptos.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        function: `${this.contractAddress}::${this.moduleName}::cancel_option` as any,
        typeArguments: [],
        functionArguments: [optionId],
      },
    });

    try {
      const txn = await aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      return txn.hash;
    } catch (error) {
      console.error('Failed to cancel option:', error);
      throw error;
    }
  }

  /**
   * Exercise an option
   */
  async exerciseOption(
    account: Account,
    optionId: number,
    settlementPrice: number,
  ): Promise<string> {
    const transaction = await aptos.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        function: `${this.contractAddress}::${this.moduleName}::exercise` as any,
        typeArguments: [],
        functionArguments: [optionId, settlementPrice],
      },
    });

    try {
      const txn = await aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      return txn.hash;
    } catch (error) {
      console.error('Failed to exercise option:', error);
      throw error;
    }
  }

  /**
   * Get number of options for a user
   */
  async getNumOptions(ownerAddress: string): Promise<number> {
    try {
      const result = await aptos.view({
        payload: {
          function: `${this.contractAddress}::${this.moduleName}::get_num_options` as any,
          typeArguments: [],
          functionArguments: [ownerAddress],
        },
      });

      return Number(result[0]);
    } catch (error) {
      console.error('Failed to get number of options:', error);
      return 0;
    }
  }

  /**
   * Get series count for a publisher
   */
  async getSeriesCount(publisherAddress: string): Promise<number> {
    try {
      const result = await aptos.view({
        payload: {
          function: `${this.contractAddress}::${this.moduleName}::get_series_count` as any,
          typeArguments: [],
          functionArguments: [publisherAddress],
        },
      });

      return Number(result[0]);
    } catch (error) {
      console.error('Failed to get series count:', error);
      return 0;
    }
  }

  /**
   * Get portfolio legs (option IDs)
   */
  async getPortfolioLegs(ownerAddress: string): Promise<number[]> {
    try {
      const result = await aptos.view({
        payload: {
          function: `${this.contractAddress}::${this.moduleName}::get_portfolio_legs` as any,
          typeArguments: [],
          functionArguments: [ownerAddress],
        },
      });

      return (result[0] as number[]).map(Number);
    } catch (error) {
      console.error('Failed to get portfolio legs:', error);
      return [];
    }
  }

  /**
   * Check if user account is initialized
   */
  async isAccountInitialized(address: string): Promise<boolean> {
    try {
      // Try to get options count - if it fails, account is not initialized
      await this.getNumOptions(address);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get APT balance for an account
   */
  async getAptBalance(address: string): Promise<number> {
    try {
      const balance = await aptos.getAccountAPTAmount({
        accountAddress: address,
      });
      return Number(balance);
    } catch (error) {
      console.error('Failed to get APT balance:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const apexContract = new ApexOptionsContract();
