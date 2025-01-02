import multer from "multer";

const storage = multer.memoryStorage();

const profilephotoUpload = multer({storage}).single('profilephoto');

const coverphotoUpload = multer({storage}).single('coverphoto');

export { profilephotoUpload, coverphotoUpload };