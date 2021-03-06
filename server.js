const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const port = 8080;

app.use(express.json());
app.use(cors());

app.get("/products", (req, res) => {
  models.Product.findAll({
    order: [["createdAt", "DESC"]],
    attributes: ["id", "name", "price", "createdAt", "seller", "imageUrl"],
  })
    .then((result) => {
      console.log("PRODUCTS :", result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.send("에러 발생");
    });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, description, price, seller } = body;
  if (!name || !description || !price || !seller) {
    res.send("모든 필드를 입력해주세요");
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

// app.get("/products/:id", (req, res) => {
//   const params = req.params;
//   const { id } = params;
//   models.Product.findOne({
//     where: {
//       id: id,
//     },
//   })
//     .then((result) => {
//       console.log("PRODUCT :", result);
//       res.send({
//         product: result,
//       });
//     })
//     .catch((error) => {});
// });

const product = {
  products: [
    {
      id: 3,
      name: "키보드",
      price: 100000,
      createdAt: "2021-03-06T06:43:54.655Z",
      seller: "조던",
      imageUrl: "images/products/soccerbal1.jpg",
    },
    {
      id: 2,
      name: "키보드",
      price: 100000,
      createdAt: "2021-03-06T06:41:08.076Z",
      seller: "조던",
      imageUrl: "images/products/soccerbal1.jpg",
    },
    {
      id: 1,
      name: "축구공",
      price: 100000,
      createdAt: "2021-03-06T06:40:50.092Z",
      seller: "조던",
      imageUrl: "images/products/soccerbal1.jpg",
    },
  ],
};

app.get("products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  product.findAll
    .then((result) => {
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.send("상품 조회에 실패했습니다.");
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
