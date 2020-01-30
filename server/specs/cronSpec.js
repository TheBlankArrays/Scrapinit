var serverHost = 'http://localhost:3000';
var should = require('should');
var assert = require('assert');
var supertest = require('supertest');
var request = supertest(serverHost);
var Sequelize = require('sequelize');
var db = require('../dbConfig');
var cronjob = require('../controllers/cronController')
var cronUtils = require('../utils/cron')

var utils = {
  url: 'http://google.com',
  ImgUserUrl: {
    user_id: 'te',
    user_url: 'st',
    email: 'test@test.com',
    cropImage: 'assets/test/google_com-filter.png',
    cropHeight: 50,
    cropWidth: 50,
    cropOriginX: 50,
    cropOriginY: 50,
    status: true,
    comparison: 'Image',
    ocrText: 'testing',
    frequency: '*/1 * * * * *',
    filter: '',
    compareVal: '5',
    stopAfterChange: true,
  },
  TextUserUrl: {
    user_id: 'te',
    user_url: 'st',
    email: 'test@test.com',
    cropImage: 'assets/test/google_com-filter.png',
    cropHeight: 50,
    cropWidth: 50,
    cropOriginX: 50,
    cropOriginY: 50,
    status: true,
    comparison: 'text',
    ocrText: 'testing',
    frequency: '*/1 * * * * *',
    filter: 'greater',
    compareVal: '1',
    stopAfterChange: true,
  },
  deleteCron: function() {
    
  }
  
}