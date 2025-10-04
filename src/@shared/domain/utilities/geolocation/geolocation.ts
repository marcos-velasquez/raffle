export const geolocation = async () => {
  const response = await fetch('https://ipapi.co/json/');
  const data = await response.json();

  return {
    ip: data.ip,
    countryCode: data.country_code,
    network: data.network,
    version: data.version,
    city: data.city,
    region: data.region,
    regionCode: data.region_code,
    country: data.country,
    countryName: data.country_name,
    countryCodeIso3: data.country_code_iso3,
    countryCapital: data.country_capital,
    countryTld: data.country_tld,
    continentCode: data.continent_code,
    inEu: data.in_eu,
    postal: data.postal,
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    utcOffset: data.utc_offset,
    countryCallingCode: data.country_calling_code,
    currency: data.currency,
    currencyName: data.currency_name,
    languages: data.languages,
    countryArea: data.country_area,
    countryPopulation: data.country_population,
    asn: data.asn,
    org: data.org,
  };
};
