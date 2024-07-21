
import multer from 'multer';
import { v4 as uuid } from 'uuid';
// we can store these data entires like photo and information
// of product in cache and then to cloud rather than disk and then it will be deleted from cache



//can also use other storage 
//destination will call callback which will return null if error else uploads

// destination will specify destination of file upload
// filename will specify name of the file
const storage= multer.diskStorage({
    destination(req, file , callback) {
        callback(null , "uploads");
    },
    filename(req, file , callback) {
        const id = uuid();
        const extname = file.originalname.split(".").pop();
        
        callback(null , `${id}.${extname}`);
    },
});



export const singleupload = multer({storage}).single("photo"); 