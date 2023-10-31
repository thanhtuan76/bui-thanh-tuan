import { useForm, Controller } from "react-hook-form";
import "./styles.scss";
import {
  Box,
  FormControl,
  TextField,
  Autocomplete,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import SwapVerticalCircleIcon from "@mui/icons-material/SwapVerticalCircle";

type FormType = {
  amountToSend: number;
  amountToReceive: number;
};

const defaulPrices = {
  currency: "",
  price: "",
  data: "",
};

export const CurrencySwapForm = () => {
  const { control, handleSubmit, setValue } = useForm<FormType>();
  const [prices, setPrices] = useState<Models.CurrencyModel[]>([]);
  const [fromCurrency, setFromCurrency] =
    useState<Models.CurrencyModel>(defaulPrices);
  const [toCurrency, setToCurrency] =
    useState<Models.CurrencyModel>(defaulPrices);
  const [receiveValue, setReceiveValue] = useState<number>(0);

  const getPrices = async () => {
    try {
      const priceList = (await axios
        .get("https://interview.switcheo.com/prices.json")
        .then((res) => res.data)) as Models.CurrencyModel[];

      setPrices(priceList);
    } catch (error) {
      console.log(error);
    }
  };

  const getPriceByCurrency = (currency: string) => {
    prices.forEach((item) => {
      if (item.currency === currency) return item.price;
      else return null;
    });
  };

  const handleSwap = (
    fromAmount: number,
    fromCurrency: string,
    toCurrency: string
  ) => {
    if (+getPriceByCurrency(fromCurrency)) {
      const toValue = (
        (fromAmount * +getPriceByCurrency(fromCurrency)) /
        +getPriceByCurrency(toCurrency)
      ).toFixed(2);
      setReceiveValue(+toValue);
      return (
        (fromAmount * +getPriceByCurrency(fromCurrency)) /
        +getPriceByCurrency(toCurrency)
      ).toFixed(2);
    } else return 0;
  };

  const onSubmit = (data: FormType) => {
    if (data) {
      handleSwap(data.amountToSend, fromCurrency.currency, toCurrency.currency);
    }
  };

  useEffect(() => {
    getPrices();
  }, []);

  useEffect(() => {
    console.log(fromCurrency);
  }, [fromCurrency]);

  return (
    <Box>
      <FormControl onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            backgroundImage: "linear-gradient(180deg, #1a2644, #0e0e2a)",
            zIndex: 0,
            padding: 4,
            borderRadius: 3,
          }}
        >
          <Typography
            component={"h1"}
            sx={{ color: "#FFF", fontSize: "2.5rem", fontWeight: 500, mb: 2 }}
          >
            Swap Form
          </Typography>
          <Box
            sx={{
              boxShadow: 3,
              p: 3,
              borderRadius: 1,
              background: "#fff",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Controller
                control={control}
                name="amountToSend"
                rules={{
                  required: "This is required",
                  pattern: {
                    value: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
                    message: "Please enter number",
                  },
                }}
                render={() => (
                  <TextField
                    size="medium"
                    InputProps={{
                      style: {
                        borderRadius: "10px",
                        padding: "0 10px",
                        border: "none",
                      },
                    }}
                    type="number"
                    variant="standard"
                    className="text-field"
                    required
                    // value={email}
                    onChange={(e) => {
                      setValue("amountToReceive", +e.target.value);
                    }}
                    label="Amount to send"
                    placeholder="Enter amount"
                  />
                )}
              />
              <Autocomplete
                sx={{ width: 300 }}
                options={
                  prices?.map((item: Models.CurrencyModel) => ({
                    label: item.currency,
                    value: item.price,
                    icon: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${item.currency}.svg`,
                  })) || []
                }
                onChange={(e, data: any) =>
                  setFromCurrency({
                    currency: data?.label,
                    price: data?.value,
                    date: "",
                  })
                }
                autoHighlight
                getOptionLabel={(option) => option.label}
                className="currency-autocomplete"
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    <img
                      loading="lazy"
                      width="20"
                      srcSet={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${option.label}.svg`}
                      src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${option.label}.svg`}
                      alt={option.label}
                    />
                    {option.label}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose a currency"
                    variant="standard"
                    fullWidth
                    // inputProps={{
                    //   ...params.inputProps,
                    //   autoComplete: "new-password", // disable autocomplete and autofill
                    // }}
                  />
                )}
              />
            </Box>
          </Box>

          <Box>
            <SwapVerticalCircleIcon
              sx={{ color: "#59a2c9", fontSize: "3.5rem", margin: "1rem 0" }}
            />
          </Box>

          <Box
            sx={{
              boxShadow: 3,
              p: 3,
              borderRadius: 1,
              background: "#fff",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Controller
                control={control}
                name="amountToReceive"
                render={() => (
                  <TextField
                    size="medium"
                    InputProps={{
                      style: {
                        borderRadius: "10px",
                        padding: "0 10px",
                        border: "none",
                      },
                      readOnly: true,
                      disabled: true,
                    }}
                    value={receiveValue}
                    variant="standard"
                    className="text-field"
                    label="Amount to receive"
                  />
                )}
              />
              <Autocomplete
                sx={{ width: 300 }}
                options={
                  prices?.map((item: Models.CurrencyModel) => ({
                    label: item.currency,
                    value: item.price,
                    icon: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${item.currency}.svg`,
                  })) || []
                }
                autoHighlight
                getOptionLabel={(option) => option.label}
                className="currency-autocomplete"
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    <img
                      loading="lazy"
                      width="20"
                      srcSet={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${option.label}.svg`}
                      src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${option.label}.svg`}
                      alt={option.label}
                    />
                    {option.label}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose a currency"
                    variant="standard"
                    fullWidth
                    // inputProps={{
                    //   ...params.inputProps,
                    //   autoComplete: "new-password", // disable autocomplete and autofill
                    // }}
                  />
                )}
              />
            </Box>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Button variant="contained" fullWidth sx={{ mt: 3, color: "#fff" }}>
              Swap
            </Button>
          </Box>
        </Box>
      </FormControl>
    </Box>
  );
};
