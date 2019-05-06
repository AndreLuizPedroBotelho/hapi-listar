db.createUser({
        user: 'teste',
        pwd: 'teste1234',
        roles: [{ role: 'readWrite', db:'herois'}]
})

db.herois.insert({
        nome:'flash',
        poder:'velocidade',
        dataNascimento:'1998-01-01'
})


