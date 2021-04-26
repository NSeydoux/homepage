const { getSolidDataset, getThing, getStringNoLocale, getUrl } = require("@inrupt/solid-client");

module.exports = async function() {
  const profileDoc = await getSolidDataset("https://solid.zwifi.eu/profile/card");
  const profile = getThing(profileDoc, "https://solid.zwifi.eu/profile/card#me");
  const name = getStringNoLocale(profile, "http://www.w3.org/2006/vcard/ns#fn")
  const picture = getUrl(profile, "http://www.w3.org/2006/vcard/ns#hasPhoto")
  return {
    name,
    picture
  };
};