declare module 'react-select-country-list' {
  interface CountryData {
    value: string;
    label: string;
  }

  interface CountryList {
    getData(): CountryData[];
    getLabel(value: string): string;
    getValue(label: string): string;
    getLabels(): string[];
    getValues(): string[];
    native(): CountryList;
    setLabel(value: string, label: string): CountryList;
    setEmpty(label: string): CountryList;
  }

  function countryList(): CountryList;
  export default countryList;
}
