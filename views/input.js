app.get("/input", (req, res) => {
    res.render("input");
 });
 
 app.post("/input", (req, res) => {
     if(!req.files || Object.keys(req.files).length === 0) {
         message = "Error: Import file not uploaded";
         return res.send(message);
     };
     //Read file line by line, inserting records
     const fn = req.files.filename;
     const buffer = fn.data;
     const lines = buffer.toString().split(/\r?\n/);
 
     lines.forEach(line => {
          //console.log(line);
          product = line.split(",");
          //console.log(product);
          const sql = "INSERT INTO PRODUCT(prod_id, prod_name, prod_desc, prod_price) VALUES ($1, $2, $3, $4)";
          pool.query(sql, product, (err, result) => {
              if (err) {
                  console.log(`Insert Error.  Error message: ${err.message}`);
              } else {
                  console.log(`Inserted successfully`);
              }
         });
     });
     message = `Processing Complete - Processed ${lines.length} records`;
     res.send(message);
 });   