const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');
import pdf from 'html-pdf';


function generarPDF(a, n){
    const archivo = a;
    const name = n; 
    pdf.create(archivo).toFile('./' + name , function(err,res){
        if (err){
            console.log(err);
        }else {
            console.log(res);
        }
    });

}

