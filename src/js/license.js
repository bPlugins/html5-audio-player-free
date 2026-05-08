import "./../css/license.scss";
import LicenseHandler from "./../../../utils/license/license";

document.addEventListener("DOMContentLoaded", function () {
  const licenseWrapper = document.querySelector(".bpllch5ap_license_popup");
  new LicenseHandler(licenseWrapper, {
    products: ["h5ap", "h5app", "h5ap2"],
    prefix: "bpllch5ap",
    info: bpllch5ap,
    db: "h5ap",
  });
});
