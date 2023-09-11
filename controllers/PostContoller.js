import PostModel from "../models/Post.js";
import TagModel from "../models/Tag.js";

export const getTags = async (req, res) => {
  try {
    const tags = await TagModel.find().exec();
    const tagNames = tags.map((tag) => tag.tag);

    res.json(tagNames);
  } catch (error) {
    return res.json({ message: "Не удалось получить теги" });
  }
};

export const create = async (req, res) => {
  try {
    const { title, text, tags, imageUrl } = req.body;

    const doc = new PostModel({
      title,
      text,
      tags,
      imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    for (const tag of tags) {
      await TagModel.findOneAndUpdate(
        { tag },
        { tag },
        { upsert: true, new: true }
      );
    }

    res.json(post);
  } catch (error) {
    return res.json({ message: "Не удалось создать статью" });
  }
};

export const getAll = async (req, res) => {
  try {
    let sortOrder = req.query.sortOrder;
    let sortOption = {};

    if (sortOrder === "viewsCount") {
      sortOption = { viewsCount: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const posts = await PostModel.find()
      .populate("user")
      .sort(sortOption)
      .exec();
    res.json(posts);
  } catch (error) {
    return res.json({ message: "Не удалось получить статьи" });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { new: true }
    )
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "fullName avatarUrl",
        },
      })
      .populate("user")
      .exec();

    if (!updatedPost) {
      return res.status(404).json({ message: "Статья не найдена" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    return res.json({ message: "Не удалось получить статью" });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const deletePost = await PostModel.findOneAndDelete({ _id: postId });

    if (!deletePost) {
      return res.status(404).json({ message: "Статья не найдена" });
    }

    res.json(deletePost);
  } catch (error) {
    console.log(error);
    return res.json({ message: "Не удалось удалить статью" });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Статья не найдена" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    return res.json({ message: "Не удалось получить статью" });
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.postId;

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        $push: {
          comments: {
            text: req.body.text,
            user: req.userId,
          },
        },
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Статья не найдена" });
    }
    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    return res.json({ message: "Не удалось добавить комментарий" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const userPosts = await PostModel.find({ user: userId })
      .populate("user")
      .sort({ createdAt: -1 })
      .exec();

    res.json(userPosts);
  } catch (error) {
    console.error(error);
    return res.json({ message: "Не удалось получить посты пользователя" });
  }
};

export const getPostsByTag = async (req, res) => {
  try {
    const tag = req.params.tag;

    const postsByTag = await PostModel.find({ tags: tag })
      .populate("user")
      .sort({ createdAt: -1 })
      .exec();

    res.json(postsByTag);
  } catch (error) {
    console.error(error);
    return res.json({ message: "Не удалось получить посты по заданному тэгу" });
  }
};
