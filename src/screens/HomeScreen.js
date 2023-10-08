import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "./styles";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import RadioInput from "../components/RadioInput";
import { genders } from "../helpers/constants";
import moment from "moment/moment";
import { API } from "../helpers/API";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const HomeScreen = () => {
  const [birthday, setBirthday] = useState(new Date());
  const [openDateInput, setOpenDateInput] = useState(false);
  const [gender, setGender] = useState(null);
  const [displayResults, setDisplayResults] = useState(false);
  const [finalRetirementDate, setFinalRetirementDate] = useState(null);
  const [error, setError] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const onSubmit = () => {
    if (!birthday || !gender) {
      setError(true);
      return;
    }
    setButtonDisabled(true);
    API.send("GET", "/calculator", { birthday, gender })
      .then((response) => response.json())
      .then((response) => {
        const { result } = response;
        setFinalRetirementDate(result);
        setDisplayResults(true);
      })
      .catch((error) => {
        setError(true);
        setBackendError(error);
      })
      .finally(() => {
        setError(false);
        setButtonDisabled(false);
      });
  };

  const ageOfRetirement = useMemo(() => {
    if (!!finalRetirementDate) {
      const age = moment(finalRetirementDate.toString(), "YYYY-MM-DD");
      if (age) {
        const yearsDiff = age.diff(birthday, "years");
        age.subtract(yearsDiff, "years");
        const monthsDiff = age.diff(birthday, "months");
        return monthsDiff === 0
          ? yearsDiff + " vjeç"
          : yearsDiff + " vjeç e " + monthsDiff + " muaj";
      }
      return "";
    }
  }, [finalRetirementDate]);

  const workExperienceYears = useMemo(() => {
    if (!finalRetirementDate) {
      return "";
    }
    let baseYears = 35;
    let baseMonths = 0;
    if (
      moment(finalRetirementDate.toString(), "YYYY-MM-DD").get("year") < 2015
    ) {
      return baseYears + " vite";
    }
    const monthsToAdd =
      (moment(finalRetirementDate.toString(), "YYYY-MM-DD").get("year") -
        2014) *
      4;
    baseYears += monthsToAdd / 12;
    baseMonths += monthsToAdd % 12;
    if (baseMonths === 12) {
      baseMonths = 0;
    }
    if (baseYears >= 40) {
      return "40 vite";
    }
    return baseMonths !== 0
      ? Math.floor(baseYears) + " vite e " + baseMonths + " muaj"
      : Math.floor(baseYears) + " vite";
  }, [finalRetirementDate]);

  const finalRetirementDateFormatted = useMemo(
    () => moment(finalRetirementDate, "YYYY-MM-DD").format("DD MMMM YYYY"),
    [finalRetirementDate],
  );

  const onClear = () => {
    setDisplayResults(false);
    setGender("male");
    setError(false);
    setFinalRetirementDate(null);
    setBirthday(new Date());
  };

  return (
    <ScrollView>
      <StyledView className="bg-green-100 pt-20 px-10 items-center">
        <StyledText className="text-2xl text-blue-700 text-center font-bold">
          Llogarit moshën e daljes në pension
        </StyledText>
        <StyledView className="p-10 mt-20 bg-white w-4/5">
          <StyledView className="items-center">
            <StyledText className="font-semibold text-lg">Gjinia</StyledText>
            <RadioInput
              options={genders}
              selectedValue={gender}
              onSelect={setGender}
              disabled={buttonDisabled}
            />
          </StyledView>
          <StyledView className="flex items-center my-14">
            <StyledText className="font-semibold text-lg">
              Datëlindja
            </StyledText>
            <StyledView className="flex flex-row space-x-5">
              <Text>{moment(birthday).format("DD MMMM YYYY")}</Text>
              <StyledTouchableOpacity
                disabled={buttonDisabled}
                onPress={() => setOpenDateInput(true)}
              >
                <StyledText className="text-blue-700">Ndrysho</StyledText>
              </StyledTouchableOpacity>
            </StyledView>
            {openDateInput && (
              <RNDateTimePicker
                maximumDate={new Date()}
                value={birthday}
                onChange={(e, date) => {
                  setOpenDateInput(false);
                  setBirthday(date);
                }}
              />
            )}
          </StyledView>
          <StyledView className="flex flex-row justify-around mb-8">
            <StyledTouchableOpacity
              disabled={buttonDisabled}
              className="border border-blue-800 p-2 bg-blue-100"
              onPress={onSubmit}
            >
              <StyledText className="text-blue-700">Llogarit</StyledText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
              disabled={buttonDisabled}
              className="border border-orange-800 p-2 bg-orange-100"
              onPress={onClear}
            >
              <StyledText className="text-orange-700">Fshij</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          {error && (
            <View>
              <StyledText className="mb-4 text-red-500 italic font-semibold text-center">
                Ju lutem vendosni të dhënat tuaja
              </StyledText>
            </View>
          )}
          {backendError && (
            <View>
              <StyledText className="mb-4 text-red-500 italic font-semibold text-center">
                {backendError}
              </StyledText>
            </View>
          )}
        </StyledView>
        {displayResults && (
          <StyledView className="mt-20 mb-5 border border-dashed rounded bg-white p-10">
            <StyledText className="text-center text-xl mb-10">
              Rezultati
            </StyledText>
            <View>
              <Text>Del në pension në {finalRetirementDateFormatted}</Text>
              <Text>Mosha e daljes në pension: {ageOfRetirement}</Text>
              <Text>Eksperienca e punës: {workExperienceYears}</Text>
            </View>
          </StyledView>
        )}
        <StatusBar style="auto" />
      </StyledView>
    </ScrollView>
  );
};

export default HomeScreen;
