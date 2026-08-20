const express = require('express');
const session = require('express-session');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SQLite database
const db = new Database(path.join(__dirname, 'pharmacy.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables if they do not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS customer (
    uid TEXT PRIMARY KEY,
    pass TEXT,
    fname TEXT,
    lname TEXT,
    email TEXT,
    address TEXT,
    phno INTEGER
  );

  CREATE TABLE IF NOT EXISTS seller (
    sid TEXT PRIMARY KEY,
    sname TEXT,
    pass TEXT,
    address TEXT,
    phno INTEGER
  );

  CREATE TABLE IF NOT EXISTS product (
    pid TEXT PRIMARY KEY,
    pname TEXT UNIQUE,
    manufacturer TEXT,
    mfg TEXT,
    exp TEXT,
    price INTEGER
  );

  CREATE TABLE IF NOT EXISTS inventory (
    pid TEXT,
    pname TEXT,
    quantity INTEGER,
    sid TEXT,
    PRIMARY KEY (pid, sid),
    FOREIGN KEY (pid) REFERENCES product(pid) ON DELETE CASCADE,
    FOREIGN KEY (sid) REFERENCES seller(sid) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS orders (
    oid INTEGER PRIMARY KEY AUTOINCREMENT,
    pid TEXT,
    sid TEXT,
    uid TEXT,
    orderdatetime TEXT,
    quantity INTEGER,
    price INTEGER,
    FOREIGN KEY (pid) REFERENCES product(pid) ON DELETE CASCADE,
    FOREIGN KEY (sid) REFERENCES seller(sid) ON DELETE CASCADE,
    FOREIGN KEY (uid) REFERENCES customer(uid) ON DELETE CASCADE
  );
`);

// Seed Demo Data if database is empty
const customerCount = db.prepare('SELECT count(*) as count FROM customer').get().count;
if (customerCount === 0) {
  console.log('Seeding initial demo data...');
  
  // Seed Customer
  db.prepare(`
    INSERT INTO customer (uid, pass, fname, lname, email, address, phno)
    VALUES ('cust123', 'pass123', 'John', 'Doe', 'john.doe@pharmacy.com', '123 Health Ave, Medical City', 9876543210)
  `).run();

  // Seed Seller
  db.prepare(`
    INSERT INTO seller (sid, sname, pass, address, phno)
    VALUES ('seller123', 'Apex Pharmacy Supplies', 'pass123', '456 Pharma Park, Suite 100', 9123456789)
  `).run();

  // Seed Products
  const insertProduct = db.prepare(`
    INSERT INTO product (pid, pname, manufacturer, mfg, exp, price)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertProduct.run('P101', 'Paracetamol 500mg', 'GlaxoSmithKline', '2024-01-10', '2026-12-31', 15);
  insertProduct.run('P102', 'Amoxicillin 250mg', 'Pfizer Labs', '2024-02-15', '2026-08-20', 45);
  insertProduct.run('P103', 'Ibuprofen 400mg', 'Bayer Healthcare', '2024-03-01', '2027-01-15', 25);
  insertProduct.run('P104', 'Vitamin C 1000mg', 'NutriPharma', '2024-04-10', '2026-11-30', 30);

  // Seed Inventory
  const insertInventory = db.prepare(`
    INSERT INTO inventory (pid, pname, quantity, sid)
    VALUES (?, ?, ?, ?)
  `);

  insertInventory.run('P101', 'Paracetamol 500mg', 100, 'seller123');
  insertInventory.run('P102', 'Amoxicillin 250mg', 50, 'seller123');
  insertInventory.run('P103', 'Ibuprofen 400mg', 75, 'seller123');
  insertInventory.run('P104', 'Vitamin C 1000mg', 120, 'seller123');

  // Seed Initial Order
  db.prepare(`
    INSERT INTO orders (pid, sid, uid, orderdatetime, quantity, price)
    VALUES ('P101', 'seller123', 'cust123', datetime('now', 'localtime'), 2, 30)
  `).run();

  console.log('Demo data seeded successfully!');
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'pharmacy-drug-management-secret-key',
  resave: false,
  saveUninitialized: true
}));

const webContentPath = path.join(__dirname, 'Pharmacy-Drug-Management-System', 'Pharmacy-Drug-Mangement', 'WebContent');

// --- Dynamic Route Handlers (MUST come BEFORE express.static so .jsp files are rendered dynamically) ---

// Default Root Route
app.get('/', (req, res) => {
  res.sendFile(path.join(webContentPath, 'Index.html'));
});

// LOGIN POST
app.post('/Login.jsp', (req, res) => {
  const { userid, password, utype } = req.body;
  const u = parseInt(utype);

  req.session.currentuser = userid;

  if (u === 1) { // Customer
    const row = db.prepare('SELECT uid, pass FROM customer WHERE uid = ?').get(userid);
    if (row) {
      if (row.pass === password) {
        return res.redirect('/Homepage.jsp');
      } else {
        return res.redirect('/LoginError1.html');
      }
    } else {
      return res.redirect('/LoginError2.html');
    }
  } else if (u === 2) { // Seller
    const row = db.prepare('SELECT sid, pass FROM seller WHERE sid = ?').get(userid);
    if (row) {
      if (row.pass === password) {
        return res.redirect('/SellerHomepage.jsp');
      } else {
        return res.redirect('/LoginError1.html');
      }
    } else {
      return res.redirect('/LoginError2.html');
    }
  } else {
    res.redirect('/LoginError2.html');
  }
});

// CUSTOMER REGISTER POST
app.post('/Register.jsp', (req, res) => {
  const { userid, password, fname, lname, email, address, phno } = req.body;
  try {
    const existing = db.prepare('SELECT uid FROM customer WHERE uid = ?').get(userid);
    if (existing) {
      return res.redirect('/RegisterError1.html');
    }
    db.prepare(`
      INSERT INTO customer (uid, pass, fname, lname, email, address, phno)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userid, password, fname, lname, email, address, phno);

    req.session.currentuser = userid;
    res.redirect('/Homepage.jsp');
  } catch (err) {
    console.error('Customer Register Error:', err);
    res.redirect('/RegisterError2.html');
  }
});

// SELLER REGISTER POST
app.post('/SellerRegister.jsp', (req, res) => {
  const { sellerid, sname, password, address, phno } = req.body;
  try {
    const existing = db.prepare('SELECT sid FROM seller WHERE sid = ?').get(sellerid);
    if (existing) {
      return res.redirect('/SellerRegisterError1.html');
    }
    db.prepare(`
      INSERT INTO seller (sid, sname, pass, address, phno)
      VALUES (?, ?, ?, ?, ?)
    `).run(sellerid, sname, password, address, phno);

    req.session.currentuser = sellerid;
    res.redirect('/SellerHomepage.jsp');
  } catch (err) {
    console.error('Seller Register Error:', err);
    res.redirect('/SellerRegisterError2.html');
  }
});

// CUSTOMER HOMEPAGE GET
app.get('/Homepage.jsp', (req, res) => {
  const guid = req.session.currentuser || 'cust123';
  const customer = db.prepare('SELECT fname, uid, address, phno, email FROM customer WHERE uid = ?').get(guid);

  if (!customer) {
    return res.send(`
      <h2>Customer not found. Please <a href="/Login.html">Login</a></h2>
    `);
  }

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="ISO-8859-1">
      <title>Home Page</title>
      <link rel="stylesheet" href="css/Homepage.css">
    </head>
    <body>
    <div class="main">
      <div class="topbar1"></div>
      <div class="topbar2">
        <div class="container1">
          <div class="logout-btn">
            <a href="/Logout.jsp">Logout</a>
          </div>
        </div>
      </div>
      <div class="header">
        <div class="container2">
          <div class="navbar">
            <a href="/Homepage.jsp">HOME</a>
            <a href="/Buy.jsp">BUY</a>
            <a href="/Orders.jsp">ORDERS</a>
          </div>
        </div>
      </div>
    </div>
    <div class="active">
      <div class="filler"></div>
      <h2>Welcome ${guid}</h2>
      <div class="filler2"></div>
      <div class="card">
        <img src="images/User.png" class="Avatar" width=234 height=234 alt="User Avatar">
        <div class="container">
          <div class="space1"><b>${customer.fname || ''}</b></div>
          <div class="filler3"></div>
          <div class="space"><b>ID: </b>${customer.uid || ''}</div>
          <div class="space"><b>Address: </b>${customer.address || ''}</div>
          <div class="space"><b>Phone: </b>${customer.phno || ''}</div>
          <div class="space"><b>Email: </b>${customer.email || ''}</div>
        </div>
      </div>
    </div>
    </body>
    </html>
  `);
});

// SELLER HOMEPAGE GET
app.get('/SellerHomepage.jsp', (req, res) => {
  const guid = req.session.currentuser || 'seller123';
  const seller = db.prepare('SELECT sname, sid, address, phno FROM seller WHERE sid = ?').get(guid);

  if (!seller) {
    return res.send(`
      <h2>Seller not found. Please <a href="/Login.html">Login</a></h2>
    `);
  }

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="ISO-8859-1">
      <title>Seller Home Page</title>
      <link rel="stylesheet" href="css/Homepage.css">
    </head>
    <body>
    <div class="main">
      <div class="topbar1"></div>
      <div class="topbar2">
        <div class="container1">
          <div class="logout-btn">
            <a href="/Logout.jsp">Logout</a>
          </div>
        </div>
      </div>
      <div class="header">
        <div class="container2">
          <div class="navbar">
            <a href="/SellerHomepage.jsp">HOME</a>
            <a href="/AddProduct.html">ADD</a>
            <a href="/AddInventory.jsp">RESTOCK</a>
            <a href="/SellerOrders.jsp">ORDERS</a>
          </div>
        </div>
      </div>
    </div>
    <div class="active">
      <div class="filler"></div>
      <h2>Welcome ${guid}</h2>
      <div class="filler2"></div>
      <div class="card">
        <img src="images/vendor.png" class="Avatar" width=264 height=194 alt="Vendor Avatar">
        <div class="container">
          <h4><b>${seller.sname || ''}</b></h4>
          <p><b>ID: </b>${seller.sid || ''}</p>
          <p><b>Address: </b>${seller.address || ''}</p>
          <p><b>Phone: </b>${seller.phno || ''}</p>
        </div>
      </div>
    </div>
    </body>
    </html>
  `);
});

// BUY PRODUCTS PAGE GET
app.get('/Buy.jsp', (req, res) => {
  const products = db.prepare(`
    SELECT p.pname, p.pid, p.manufacturer, p.mfg, p.price, i.quantity 
    FROM product p 
    JOIN inventory i ON p.pid = i.pid
  `).all();

  let cardsHtml = '';
  products.forEach(p => {
    cardsHtml += `
      <div class="column">
        <div class="card">
          <img src="images/pills.png" width=180 height=200 alt="Pills">
          <h1>${p.pname}</h1>
          <p><b>ID: </b>${p.pid}</p>
          <p><b>Manufacturer: </b>${p.manufacturer}</p>
          <p><b>Mfg Date: </b>${p.mfg}</p>
          <p><b>Stock: </b>${p.quantity}</p>
          <p><b>Price: </b>$${p.price}</p>
          ${p.quantity > 0 ? `
            <form action="/PlaceOrder.jsp" method="post">
              <input type="number" name="orderquantity" min="1" max="${p.quantity}" placeholder="Enter quantity" required >
              <input type="hidden" name="pid" value="${p.pid}">
              <p></p>
              <button type="submit">Buy</button>
            </form>
          ` : `
            <button disabled style="background-color: #999; cursor: not-allowed;">Out Of Stock</button>
          `}
        </div>
      </div>
    `;
  });

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="ISO-8859-1">
      <title>Buy Products</title>
      <link rel="stylesheet" href="css/Buy.css">
    </head>
    <body>
    <div class="main">
      <div class="topbar1"></div>
      <div class="topbar2">
        <div class="container1">
          <div class="logout-btn">
            <a href="/Logout.jsp">Logout</a>
          </div>
        </div>
      </div>
      <div class="header">
        <div class="container2">
          <div class="navbar">
            <a href="/Homepage.jsp">HOME</a>
            <a href="/Buy.jsp">BUY</a>
            <a href="/Orders.jsp">ORDERS</a>
          </div>
        </div>
      </div>
    </div>
    <div class="active">
      <div class="filler"></div>
      <div class="filler2"></div>
      <div class="block">
        <div class="row">
          ${cardsHtml}
        </div>
      </div>
    </div>
    </body>
    </html>
  `);
});

// PLACE ORDER POST
app.post('/PlaceOrder.jsp', (req, res) => {
  const { pid, orderquantity } = req.body;
  const qr = parseInt(orderquantity);
  const guid = req.session.currentuser || 'cust123';

  try {
    const item = db.prepare(`
      SELECT p.pid, i.sid, p.price, i.quantity 
      FROM inventory i 
      JOIN product p ON p.pid = i.pid 
      WHERE p.pid = ?
    `).get(pid);

    if (item && item.quantity >= qr) {
      const totalPrice = qr * item.price;
      const orderDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

      // Insert Order
      db.prepare(`
        INSERT INTO orders (pid, sid, uid, orderdatetime, quantity, price)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(item.pid, item.sid, guid, orderDate, qr, totalPrice);

      // Deduct Inventory Stock
      db.prepare(`
        UPDATE inventory SET quantity = quantity - ? WHERE pid = ?
      `).run(qr, item.pid);

      res.redirect('/Orders.jsp');
    } else {
      res.send(`
        <script>
          alert('Not enough stock available!');
          window.location.href = '/Buy.jsp';
        </script>
      `);
    }
  } catch (err) {
    console.error('Place Order Error:', err);
    res.status(500).send('Error placing order: ' + err.message);
  }
});

// CUSTOMER ORDERS GET
app.get('/Orders.jsp', (req, res) => {
  const gid = req.session.currentuser || 'cust123';
  const orders = db.prepare('SELECT * FROM orders WHERE uid = ? ORDER BY oid DESC').all(gid);

  let rowsHtml = '';
  orders.forEach(o => {
    rowsHtml += `
      <tr>
        <td>${o.oid}</td>
        <td>${o.pid}</td>
        <td>$${o.price}</td>
        <td>${o.quantity}</td>
        <td>${o.sid}</td>
        <td>${o.orderdatetime}</td>
      </tr>
    `;
  });

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="ISO-8859-1">
      <title>Customer Orders</title>
      <link rel="stylesheet" href="css/Orders.css">
    </head>
    <body>
    <div class="main">
      <div class="topbar1"></div>
      <div class="topbar2">
        <div class="container1">
          <div class="logout-btn">
            <a href="/Logout.jsp">Logout</a>
          </div>
        </div>
      </div>
      <div class="header">
        <div class="container2">
          <div class="navbar">
            <a href="/Homepage.jsp">HOME</a>
            <a href="/Buy.jsp">BUY</a>
            <a href="/Orders.jsp">ORDERS</a>
          </div>
        </div>
      </div>
    </div>
    <div class="active">
      <div class="filler"></div>
      <div class="filler2"></div>
      <table class="tables">
        <tr>
          <th>Order ID</th>
          <th>Product ID</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Seller ID</th>
          <th>Order Date and Time</th>
        </tr>
        ${rowsHtml || '<tr><td colspan="6">No orders found.</td></tr>'}
      </table>
    </div>
    </body>
    </html>
  `);
});

// ADD PRODUCT POST
app.post('/AddProduct.jsp', (req, res) => {
  const { prid, prname, mfname, mdate, edate, price, quantity } = req.body;
  const guid = req.session.currentuser || 'seller123';

  try {
    const existing = db.prepare('SELECT pid FROM product WHERE pid = ?').get(prid);
    if (!existing) {
      db.prepare(`
        INSERT INTO product (pid, pname, manufacturer, mfg, exp, price)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(prid, prname, mfname, mdate, edate, parseInt(price));

      db.prepare(`
        INSERT INTO inventory (pid, pname, sid, quantity)
        VALUES (?, ?, ?, ?)
      `).run(prid, prname, guid, parseInt(quantity));

      res.redirect('/AddInventory.jsp');
    } else {
      res.redirect('/AddProductError.html');
    }
  } catch (err) {
    console.error('Add Product Error:', err);
    res.redirect('/AddProductError2.html');
  }
});

// ADD INVENTORY (RESTOCK PAGE) GET
app.get('/AddInventory.jsp', (req, res) => {
  const guid = req.session.currentuser || 'seller123';
  const products = db.prepare(`
    SELECT p.pid, i.quantity, p.pname, p.manufacturer, p.mfg, p.exp, p.price 
    FROM product p 
    JOIN inventory i ON p.pid = i.pid 
    WHERE i.sid = ?
  `).all(guid);

  let cardsHtml = '';
  products.forEach(p => {
    cardsHtml += `
      <div class="column">
        <div class="card">
          <form action="/UpdateInventory.jsp" method="post">
            <img src="images/pills.png" width=180 height=200 alt="Pills">
            <h1>${p.pname}</h1>
            <p><b>ID: </b>${p.pid}</p>
            <p><b>Manufacturer: </b>${p.manufacturer}</p>
            <p><b>Mfg Date: </b>${p.mfg}</p>
            <p><b>Exp Date: </b>${p.exp}</p>
            <p><b>Stock: </b>${p.quantity}</p>
            <p><b>Price: </b>$${p.price}</p>
            <p><input type="number" name="restock" min="1" placeholder="Add quantity" required></p>
            <input type="hidden" name="pid" value="${p.pid}">
            <p></p>
            <button type="submit">ReStock</button>
          </form>
        </div>
      </div>
    `;
  });

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="ISO-8859-1">
      <title>ReStock Inventory</title>
      <link rel="stylesheet" href="css/Buy.css">
    </head>
    <body>
    <div class="main">
      <div class="topbar1"></div>
      <div class="topbar2">
        <div class="container1">
          <div class="logout-btn">
            <a href="/Logout.jsp">Logout</a>
          </div>
        </div>
      </div>
      <div class="header">
        <div class="container2">
          <div class="navbar">
            <a href="/SellerHomepage.jsp">HOME</a>
            <a href="/AddProduct.html">ADD</a>
            <a href="/AddInventory.jsp">RESTOCK</a>
            <a href="/SellerOrders.jsp">ORDERS</a>
          </div>
        </div>
      </div>
    </div>
    <div class="active">
      <div class="filler"></div>
      <div class="filler2"></div>
      <div class="block">
        <div class="row">
          ${cardsHtml || '<p style="color:white;">No products found in your inventory.</p>'}
        </div>
      </div>
    </div>
    </body>
    </html>
  `);
});

// UPDATE INVENTORY POST
app.post('/UpdateInventory.jsp', (req, res) => {
  const { pid, restock } = req.body;
  const qt = parseInt(restock);
  const guid = req.session.currentuser || 'seller123';

  try {
    db.prepare(`
      UPDATE inventory 
      SET quantity = quantity + ? 
      WHERE sid = ? AND pid = ?
    `).run(qt, guid, pid);

    res.redirect('/AddInventory.jsp');
  } catch (err) {
    console.error('Update Inventory Error:', err);
    res.status(500).send('Error updating inventory: ' + err.message);
  }
});

// SELLER ORDERS GET
app.get('/SellerOrders.jsp', (req, res) => {
  const guid = req.session.currentuser || 'seller123';
  const orders = db.prepare('SELECT * FROM orders WHERE sid = ? ORDER BY oid DESC').all(guid);

  let rowsHtml = '';
  orders.forEach(o => {
    rowsHtml += `
      <tr>
        <td>${o.oid}</td>
        <td>${o.pid}</td>
        <td>$${o.price}</td>
        <td>${o.quantity}</td>
        <td>${o.uid}</td>
        <td>${o.orderdatetime}</td>
      </tr>
    `;
  });

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="ISO-8859-1">
      <title>Vendor Orders</title>
      <link rel="stylesheet" href="css/Orders.css">
    </head>
    <body>
    <div class="main">
      <div class="topbar1"></div>
      <div class="topbar2">
        <div class="container1">
          <div class="logout-btn">
            <a href="/Logout.jsp">Logout</a>
          </div>
        </div>
      </div>
      <div class="header">
        <div class="container2">
          <div class="navbar">
            <a href="/SellerHomepage.jsp">HOME</a>
            <a href="/AddProduct.html">ADD</a>
            <a href="/AddInventory.jsp">RESTOCK</a>
            <a href="/SellerOrders.jsp">ORDERS</a>
          </div>
        </div>
      </div>
    </div>
    <div class="active">
      <div class="filler"></div>
      <div class="filler2"></div>
      <table class="tables">
        <tr>
          <th>Order ID</th>
          <th>Product ID</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Customer ID</th>
          <th>Order Date and Time</th>
        </tr>
        ${rowsHtml || '<tr><td colspan="6">No orders found.</td></tr>'}
      </table>
    </div>
    </body>
    </html>
  `);
});

// LOGOUT GET
app.get('/Logout.jsp', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/Index.html');
  });
});

// Serve static assets AFTER dynamic JSP handlers
app.use(express.static(webContentPath));

// Start Web Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` Pharmacy Drug Management System Web Server Running!`);
  console.log(` Server URL: http://localhost:${PORT}`);
  console.log(`===================================================`);
});
