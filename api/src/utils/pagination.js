
const  defaultPage = 1;
const  defaultLimit = 10;


function getPaginationParams(query) {
  const page = parseInt(query.page, 10) || defaultPage;
  const limit = parseInt(query.limit, 10) || defaultLimit;
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

module.exports =  getPaginationParams ;
