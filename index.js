const express = require("express");
const app = express();

const { User } = require("./models")

const { cloudinary } = require('./utils/cloudinary');

const uploadFile = require("./multer");

const { setLog } = require('./helper/logger');

app.post("/upload", uploadFile.single('image'), async (req, res) => {
  try {
    const fileStr = req.file.path;

    const uploadRes = await cloudinary.uploader.upload(fileStr, {
        upload_preset: 'dev_setup'
     });
    
    const createUser = await User.create({
      name: req.body.name,
      profilePicture: uploadRes.secure_url,
      cloudinaryId: uploadRes.public_id,
    });
      res.json({
        msg: 'file upload successfully',
        createUser
    });
  }catch (err) {
    console.log(err);
    res.status(500).json({err: 'something wrong'});
  }
});

app.put("/upload/:id", uploadFile.single('image'), async (req, res) => {
  try {
    const fileStr = req.file.path;
    const { id: userId } = req.params;
    const getUser = await User.findOne({
      where: { id: userId }
    });
    const { cloudinaryId } = getUser;
    if (cloudinaryId) {
    await cloudinary.uploader.destroy(cloudinaryId, (err, result) => {
      console.log(result);
    });
  }
    const uploadRes = await cloudinary.uploader.upload(fileStr, {
      upload_preset: 'dev_setup'
   });
    const edtUser = await User.update({
      name: req.body.name,
      profilePicture: uploadRes.secure_url,
      cloudinaryId: uploadRes.public_id,
    }, { where: { id: userId} });

    res.json({
      msg: 'edit successfully',
      edtUser
  });
}catch (err) {
  console.log(err);
  res.status(500).json({err: 'something wrong'});
}});

app.delete("/upload/:id", async (req, res) => {
  try {
    const { id: userId } = req.params;
    const getUser = await User.findOne({
      where: { id: userId }
    });
    const { cloudinaryId } = getUser;
    await cloudinary.uploader.destroy(cloudinaryId, (err, result) => { 
      setLog({ 
        level: 'index.js', 
        method: 'delete user profile', 
        message: `response: ${result}`, 
        others: cloudinaryId
      });
     });
    const user = await User.destroy({
      where: { id: userId },
    });
    res.send({
      status: 200,
      message: 'Your profile has been delete',
      data: { 
        user,
    } 
  })
  } catch (err) {
    console.log(err);
    res.send({
        status:500,
        data:[],
        message:'Delete user failed'
      })
  }
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
