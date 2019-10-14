var vcapServices = JSON.parse(process.env.VCAP_SERVICES || {});
var services = vcapServices['user-provided'] || [];

function getServiceCreds(name) {
  const service = services.filter(service => service.name === name)[0] || {};
  return service.credentials || {};
}

module.exports = {
  getServiceCreds
};
