exports = async function(request, response) {
  
  var serviceName = "mongodb-atlas";

  var dbName = "test";
  var collName = "cust_prod_review";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);
  
  var result;
  
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
    
    result = {
      pk: productList[0].pk,
      customer_id: memberNumber,
      categories: categories,
      recommendation_id: "bpph"
    }
    
  } catch(err) {
    return { error: "Require memberNumber" };
  }
  
  return result;
};
