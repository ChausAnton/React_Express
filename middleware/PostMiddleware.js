const db = require('../models');
const Category_sub_table = db.Category_sub_table;
const Post = db.Post
const { Op } = require("sequelize");

exports.addCategory = async(CategroyJson, postID) => {
    Category_sub_table.destroy({where: {post_id: postID}}).then(async() => {
        for(const [key, value] of Object.entries(CategroyJson)) {
            $data = {
                post_id: postID,
                category_id: value
            };
            try {
                await Category_sub_table.create($data);
            }
            catch (e) {
                console.log(e);
            }
        }
    });
};

exports.getCategoriesForPost = async(postID) => {
    return await Category_sub_table.findAll({where: {post_id: postID}})
};

exports.getPostForPage = (page, posts) => {
    if(!page && page != 0) {
        return posts;
    }
    const postsPerPage = 10;

    const startPost = page * postsPerPage;
    const endPost = page * postsPerPage + 10;
    let pagePosts = [];

    for(let i = startPost; i < endPost; i++) {
        if(posts[i])
            pagePosts.push(posts[i]);
    }
    return pagePosts;
};

exports.getPostsByCategory = async(CategroyJson) => {
    let posts;
    let categories_id = [];
    let posts_id = [];
    for(const [key, value] of Object.entries(CategroyJson)) {
        categories_id.push(value);
    }

    categories = await Category_sub_table.findAll({where: 
        {category_id:  {
                [Op.or]: categories_id
            }
        }
    });

    for(let cat of categories) {
        posts_id.push(cat.post_id);
    }
    posts = await Post.findAll({where: 
        {id:  {
                [Op.or]: posts_id
            }
        }
    });
    
    return posts;
};