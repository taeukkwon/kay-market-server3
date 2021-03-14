const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/banners", (req, res) => {
  models.Banner.findAll({
    limit: 2,
  })
    .then((result) => {
      res.send({
        banners: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러가 발생했습니다");
    });
});

app.get("/products", (req, res) => {
  models.Product.findAll({
    order: [["createdAt", "DESC"]],
    attributes: ["id", "name", "price", "createdAt", "seller", "imageUrl"],
  })
    .then((result) => {
      console.log("PRODUCTS :", result);
      res.send({
        bananas: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.send("에러 발생");
    });
});

// app.get("/products", (req, res) => {
//   const query = req.query.name;
//   models.Product.findAll({
//     where: {
//       name: query,
//     },
//   })
//     .then((result) => {
//       console.log("PRODUCTS :", result);
//       res.send({
//         product: result,
//       });
//     })
//     .catch((error) => {
//       console.error(error);
//       res.send("에러 발생");
//     });
// });

app.post("/products", (req, res) => {
  const body = req.body;
  console.log(body);
  const { name, description, price, seller } = body;

  console.log(name);
  if (!name || !description || !price || !seller) {
    return res.send("모든 필드를 입력해주세요");
  }

  models.Product.create({
    name,
    description,
    price,
    seller,
  })
    .then((result) => {
      console.log("상품 생성 결과 :", result);
      res.send(result);
    })
    .catch((error) => {
      console.error(error);
      res.send("상품 업로드에 문제가 발생했습니다");
    });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("PRODUCT :", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {});
});

// app.get("/products/:id", (req, res) => {
//   const params = req.params;
//   const { id } = params;
//   var products = {
//     1: {
//       name: "축구공",
//       price: 5000,
//     },
//     2: {
//       name: "농구공",
//       price: 25000,
//     },
//     3: {
//       name: "탁구공",
//       price: 1000,
//     },
//   };

//   // const id = params.id
//   const product = products[id];
//   console.log(product);
//   res.send({ product: product });

//   // product.findAll
//   //   .then((result) => {
//   //     res.send({
//   //       product: result,
//   //     });
//   //   })
//   //   .catch((error) => {
//   //     console.log(error);
//   //     res.send("상품 조회에 실패했습니다.");
//   //   });
// });

app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    imageUrl: file.path,
  });
});

app.post("/purchase/:id", (req, res) => {
  const { id } = req.params;
  models.Product.update(
    {
      soldout: 1,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((result) => {
      res.send({
        result: true,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러가 발생했습니다");
    });
});

app.listen(port, () => {
  console.log("그랩 마켓의 서버가 돌아가고 있습니다.");
  models.sequelize
    .sync()
    .then(() => {
      console.log("✓ DB 연결 성공");
    })
    .catch(function (err) {
      console.error(err);
      console.log("✗ DB 연결 에러");
      process.exit();
    });
});
