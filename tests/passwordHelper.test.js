const assert = require('assert')
const PasswordHelper = require('../src/helpers/passwordHelper')

const SENHA = 'teste1234'
const HASH ='$2b$04$.zi2fHvAT4xfJGsQSxDZ5uI/0Q3yYIagAg.hAP8l3YsD4C9pilgjC'

describe('UserHelper test suite',function(){
    it('deve gerar um hash a partir de uma senha', async ()=>{
        const result = await PasswordHelper.hashPassword(SENHA)
        assert.ok(result.length >10)
    })
    
    it('deve comparar uma senha e seu hash', async ()=>{
        const result = await PasswordHelper.comparePassword(SENHA,HASH)
        assert.ok(result)
    })
})
