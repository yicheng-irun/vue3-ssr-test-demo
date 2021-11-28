import express from "express";

export const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.send({
    success: true,
    data: {
      hello: "world",
    },
  });
});

apiRouter.get("/hello", (req, res) => {
  res.send({
    success: true,
    data: "你好！这是来自服务端的问候",
  });
});
