import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from '@emotion/react';
import WeatherCard from './views/WeatherCard';
import { getMoment, findLocation } from './utils/helpers';
import styled from '@emotion/styled';
import useWeatherAPI from './hooks/useWeatherAPI';
import WeatherSetting from './views/WeatherSetting';

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const Container = styled.div`
  background-color: ${({theme}) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AUTHORIZATION_KEY = 'CWB-08A140E2-F899-41C8-A4D3-E364710C6208';
// const LOCATION_NAME = '臺北';
// const LOCATION_NAME_FORECAST = '臺北市';

const App = () => {
  const storageCity = localStorage.getItem('cityName');
  const [currentTheme, setCurrentTheme] = useState('light');  
  const [currentPage, setCurrentPage] = useState('WeatherCard');  
  const [currentCity, setCurrentCity] = useState(storageCity);
  // currentCity不變，currentLocation不需重新轉譯
  const currentLocation = useMemo(() => 
    findLocation(currentCity)
  ,[currentCity]);

  const { cityName, locationName, sunriseCityName } = currentLocation;

  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);
  // const moment = useMemo(() => getMoment(LOCATION_NAME_FORECAST), []);

  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };
  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };
  // 設定背景，透過 moment
  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [moment]);

  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    // locationName: LOCATION_NAME,
    // cityName: LOCATION_NAME_FORECAST,
    authorizationKey: AUTHORIZATION_KEY,
  });

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {/* console.log(isLoading) */}
        {
          currentPage === 'WeatherCard' && (
            <WeatherCard
              cityName={cityName}
              weatherElement={weatherElement}
              moment={moment}
              fetchData={fetchData}
              handleCurrentPageChange={handleCurrentPageChange}
            />
          )
        }
        { currentPage === 'WeatherSetting' && (
          <WeatherSetting 
            cityName={cityName}
            handleCurrentCityChange={handleCurrentCityChange}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;