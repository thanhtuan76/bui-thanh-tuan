import { useForm, Controller } from "react-hook-form";
import "./styles.scss";
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import SwapVerticalCircleIcon from "@mui/icons-material/SwapVerticalCircle";
import IconDefault from "../../assets/react.svg";

type FormType = {
  amountToSend: number;
  pricesFrom: any;
  pricesTo: any;
};

const defaulPrices = {
  currency: "",
  price: 0,
  date: "",
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

      setPrices(removeDuplicateItem(priceList));
    } catch (error) {
      console.log(error);
    }
  };

  const removeDuplicateItem = (list: Models.CurrencyModel[]) => {
    if (list && list?.length !== 0) {
      const uniqueItem = Array.from(
        new Set(list.map((item) => item.currency))
      ).map((currency) => {
        return list.find((item) => item.currency === currency);
      }) as Models.CurrencyModel[];
      return uniqueItem;
    } else return list;
  };

  const getPriceByCurrency = (currency: string) => {
    if (prices && currency) {
      const priceItem = prices.find((item: Models.CurrencyModel) => {
        if (item.currency.toLowerCase() === currency.toLowerCase()) {
          return item;
        }
      });
      return priceItem ? priceItem?.price : 0;
    } else {
      return 0;
    }
  };

  const handleSwap = (
    fromAmount: number,
    fromCurrency: string,
    toCurrency: string
  ) => {
    if (
      getPriceByCurrency(fromCurrency) &&
      getPriceByCurrency(fromCurrency) !== 0
    ) {
      const toValue =
        (fromAmount * getPriceByCurrency(fromCurrency)) /
        getPriceByCurrency(toCurrency);

      setReceiveValue(+toValue.toFixed(6));
      getPriceByCurrency(fromCurrency);
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
      <form onSubmit={handleSubmit(onSubmit)}>
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
                    value: /^[0-9]+$/,
                    message: "Please enter valid number",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    size="medium"
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                      style: {
                        borderRadius: "10px",
                        padding: "0 10px",
                        border: "none",
                      },
                    }}
                    variant="standard"
                    className="text-field"
                    onChange={(e) => {
                      setValue("amountToSend", +e.target.value);
                      field.onChange(e);
                    }}
                    label="Amount to send"
                    placeholder="Enter amount"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="pricesFrom"
                control={control}
                rules={{
                  required: "Please enter currency",
                }}
                render={({ field, fieldState }) => {
                  return (
                    <Autocomplete
                      {...field}
                      sx={{ width: 300 }}
                      options={
                        prices?.map((item: Models.CurrencyModel) => ({
                          label: item.currency,
                          value: item.price,
                          icon: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${item.currency}.svg`,
                        })) || []
                      }
                      onChange={(_, data: any) => {
                        setFromCurrency({
                          currency: data?.label,
                          price: data?.value,
                          date: "",
                        });
                        field.onChange(data);
                      }}
                      autoHighlight
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, value) =>
                        option.label === value.label
                      }
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
                            srcSet={option.icon || IconDefault}
                            src={option.icon || IconDefault}
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
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                  );
                }}
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
              <TextField
                size="medium"
                InputProps={{
                  style: {
                    borderRadius: "10px",
                    padding: "0 10px",
                    border: "none",
                  },
                  readOnly: true,
                }}
                aria-readonly
                value={receiveValue}
                variant="standard"
                className="text-field"
                label="Amount to receive"
              />
              <Controller
                name="pricesTo"
                control={control}
                rules={{
                  required: "Please enter currency",
                }}
                render={({ field, fieldState }) => {
                  return (
                    <Autocomplete
                      {...field}
                      sx={{ width: 300 }}
                      options={
                        prices?.map((item: Models.CurrencyModel) => ({
                          label: item.currency,
                          value: item.price,
                          icon: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${item.currency}.svg`,
                        })) || []
                      }
                      onChange={(_, data: any) => {
                        setToCurrency({
                          currency: data?.label,
                          price: data?.value,
                          date: "",
                        });
                        field.onChange(data);
                      }}
                      autoHighlight
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, value) =>
                        option.label === value.label
                      }
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
                            srcSet={option.icon || IconDefault}
                            src={option.icon || IconDefault}
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
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                  );
                }}
              />
            </Box>
          </Box>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, color: "#fff" }}
            type="submit"
          >
            Swap
          </Button>
        </Box>
      </form>
    </Box>
  );
};
