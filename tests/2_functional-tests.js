const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const validSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
  const invalidPuzzle = '125452.84.163.12.7....5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const badCharPuzzle = 'alsiekdiwodkflwieskdoqkdifieoakfksla;aowrkflsjfskdowkelfa;sofiwekfjsidof;alsifaia';
  const not81Puzzle = '123456789';
  const incompletePuzzle = '1................................................................................';

  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done){
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: validPuzzle
      })
      .end(function(err, res) {
        assert.equal(res.status, 200, 'response should return status 200');
        assert.isObject(res.body, 'response should be a JSON object');
        assert.property(res.body, 'solution', 'response body should have a solution property');
        assert.equal(res.body.solution, validSolution, 'response solution should equal expected valid solution');
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done){
    chai
      .request(server)
      .post('/api/solve')
      .end(function(err, res) {
        assert.equal(res.status, 200, 'response should return status 200');
        assert.isObject(res.body, 'response should be a JSON object');
        assert.property(res.body, 'error', 'response body should have an error property');
        assert.equal(res.body.error, 'Required field missing', 'response error should equal "Required field missing"');
        done();
      });
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done){
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: badCharPuzzle
      })
      .end(function(err, res) {
        assert.equal(res.status, 200, 'response should return status 200');
        assert.isObject(res.body, 'response should be a JSON object');
        assert.property(res.body, 'error', 'response body should have an error property');
        assert.equal(res.body.error, 'Invalid characters in puzzle', 'response error should equal "Invalid characters in puzzle"');
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done){
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: not81Puzzle
      })
      .end(function(err, res) {
        assert.equal(res.status, 200, 'response should return status 200');
        assert.isObject(res.body, 'response should be a JSON object');
        assert.property(res.body, 'error', 'response body should have an error property');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'response error should equal "Expected puzzle to be 81 characters long"');
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done){
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: incompletePuzzle
      })
      .end(function(err, res) {
        assert.equal(res.status, 200, 'response should return status 200');
        assert.isObject(res.body, 'response should be a JSON object');
        assert.property(res.body, 'error', 'response body should have an error property');
        assert.equal(res.body.error, 'Puzzle cannot be solved', 'response error should equal "Puzzle cannot be solved"');
        done();
      });
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', function(done){
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'G4',
        value: '2'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200, 'response should return status 200');
        assert.isObject(res.body, 'response should be a JSON object');
        assert.property(res.body, 'valid', 'response body should have a valid property');
        assert.property(res.body, 'conflict', 'response body should have a conflict property');
        assert.isTrue(res.body.valid, 'response valid should equal true');
        assert.deepEqual(res.body.conflict, [], 'response conflict should equal empty array');
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done){
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'G4',
        value: '3'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200, 'response should return status 200');
        assert.isObject(res.body, 'response should be a JSON object');
        assert.property(res.body, 'valid', 'response body should have a valid property');
        assert.property(res.body, 'conflict', 'response body should have a conflict property');
        assert.isFalse(res.body.valid, 'response valid should equal false');
        assert.deepEqual(res.body.conflict, ['column'], 'response conflict should equal array with "column"');
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done){
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'G4',
        value: '4'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200, 'response should return status 200');
        assert.isObject(res.body, 'response should be a JSON object');
        assert.property(res.body, 'valid', 'response body should have a valid property');
        assert.property(res.body, 'conflict', 'response body should have a conflict property');
        assert.isFalse(res.body.valid, 'response valid should equal false');
        assert.deepEqual(res.body.conflict, ['row', 'region'], 'response conflict should equal array with "row" and "region"');
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done){
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'B1',
        value: '2'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200, 'response should return status 200');
        assert.isObject(res.body, 'response should be a JSON object');
        assert.property(res.body, 'valid', 'response body should have a valid property');
        assert.property(res.body, 'conflict', 'response body should have a conflict property');
        assert.isFalse(res.body.valid, 'response valid should equal false');
        assert.deepEqual(res.body.conflict, ['row', 'column', 'region'], 'response conflict should equal array with "row", "column" and "region"');
        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done){
    chai
      .request(server)
      .post('/api/check')
      .end(function(err, res) {
        assert.equal(res.status, 200, 'response should return status 200');
        assert.isObject(res.body, 'response should be a JSON object');
        assert.property(res.body, 'error', 'response body should have an error property');
        assert.equal(res.body.error, 'Required field(s) missing', 'response error should equal "Required field(s) missing"');
        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done){
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: badCharPuzzle,
        coordinate: 'B1',
        value: '2'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200, 'response should return status 200');
        assert.isObject(res.body, 'response should be a JSON object');
        assert.property(res.body, 'error', 'response body should have an error property');
        assert.equal(res.body.error, 'Invalid characters in puzzle', 'response error should equal "Invalid characters in puzzle"');
        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done){
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: not81Puzzle,
        coordinate: 'B1',
        value: '2'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200, 'response should return status 200');
        assert.isObject(res.body, 'response should be a JSON object');
        assert.property(res.body, 'error', 'response body should have an error property');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'response error should equal "Expected puzzle to be 81 characters long"');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done){
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'R$',
        value: '2'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200, 'response should return status 200');
        assert.isObject(res.body, 'response should be a JSON object');
        assert.property(res.body, 'error', 'response body should have an error property');
        assert.equal(res.body.error, 'Invalid coordinate', 'response error should equal "Invalid coordinate"');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done){
  chai
    .request(server)
    .post('/api/check')
    .send({
      puzzle: validPuzzle,
      coordinate: 'B1',
      value: '22'
    })
    .end(function(err, res) {
      assert.equal(res.status, 200, 'response should return status 200');
      assert.isObject(res.body, 'response should be a JSON object');
      assert.property(res.body, 'error', 'response body should have an error property');
      assert.equal(res.body.error, 'Invalid value', 'response error should equal "Invalid value"');
      done();
    });
  });
});

