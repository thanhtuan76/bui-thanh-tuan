import React from "react";
import WalletRow from "./WalletRow"; // Assuming WalletRow component is imported
import classes from "./styles.module.scss"; // Assuming the classes is imported
import { useWalletBalances, usePrices } from "./hooks"; // Assuming the classes is imported

interface Props {
  // Add necessary props if required
}

interface WalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  blockchain: any;
}

interface Props {
  children: any;
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const rows = balances
    .filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      return balancePriority > -99 && balance.amount > 0;
    })
    .sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      return rightPriority - leftPriority;
    })
    .map((balance: WalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      const formattedAmount = balance.amount.toFixed();
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={formattedAmount}
        />
      );
    });

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
