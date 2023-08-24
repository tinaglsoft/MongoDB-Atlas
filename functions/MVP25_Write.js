exports = async function(request, response) {
  
  var serviceName = "mongodb-atlas";

  var dbName = "test";
  var collName = "cust_prod_review";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);
  
  try {
    const body = JSON.parse(request.body.text());

    await collection.insertOne(body);
    
  } catch(err) {
    console.log("Error occurred while executing insertOne:", err.message);

    return { error: err.message };
  }

  return 'Insert Success';
};
