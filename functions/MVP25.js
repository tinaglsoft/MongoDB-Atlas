exports = async function(request, response) {
  
  var serviceName = "mongodb-atlas";

  var dbName = "sample_database";
  var collName = "sample_collection";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);
  
  try {
    let body = JSON.parse(request.body.text());
    let memberNumber = body.memberNumber;
    
    if(!body) throw 1;
    if(!memberNumber || memberNumber.trim() == '') throw 2;

    const productList = await collection.find({ pk: `bpph_${memberNumber}`}).toArray();
    const category_code = productList[0].categories.map( item => item.category_code );
    const products = productList[0].categories.map( item => item.products );
    
    const categories = category_code.map((code, index) => {
      return {
        category_code: code,
        products: products[index]
      };
    });
    
    response.setStatusCode(200);

    response.setHeader(
      "Content-Type",
      "application/json"
    );
    
    response.setBody(
      JSON.stringify({
        pk: productList[0].pk,
        customer_id: memberNumber,
        categories: categories,
        recommendation_id: "bpph"
      })
    );
    
  } catch(err) {
    response.setStatusCode(400);

    response.setHeader(
      "Content-Type",
      "application/json"
    );

    response.setBody(
      JSON.stringify(
        {error: 'Require memberNumber'}
      )
    );
  }
};
