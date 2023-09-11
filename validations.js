import { body } from "express-validator";

export const registerValidator = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум из 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Укажите имя").isLength({ min: 3 }),
  body("avatarUrl", "Неверная ссылка на аватарку").optional(),
];

export const loginValidator = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум из 5 символов").isLength({
    min: 5,
  }),
];

export const postValidator = [
  body("title", "Введите заголовок статьи").isLength({ min: 5 }).isString(),
  body("text", "Введите текст статьи")
    .isLength({
      min: 5,
    })
    .isString(),
  body("tags", "Неверный формат тэгов (укажите массив)").optional().isArray(),
  body("imageUrl", "Неверный формат ссылки на изображение").optional(),
];
