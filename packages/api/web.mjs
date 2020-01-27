import express from 'express';
import path    from 'path';



const router = express.Router();



const ui_folder = process.env.UI_PATH_CWD;
router.use('/',  express.static(path.join(process.cwd(), ui_folder)));
router.use('/*', express.static(path.join(process.cwd(), ui_folder, './index.html')));



export default router;