export const env = {
  // Routed through open-job-dmi.unictdev.org (path /opis-api) instead of
  // api-opis.unictdev.org: the latter is re-signed by UNICT's TLS-inspection
  // proxy with an untrusted internal CA on campus, breaking the API. The
  // open-job-dmi host passes through uninspected. See issue #118.
  api_url: "https://open-job-dmi.unictdev.org/opis-api/api",
  github_api_url: "https://api.github.com/repos/UNICT-DMI",
  ga_measurement_id: "G-CDTHNXP2JY",
  ga_enabled: true,
};
