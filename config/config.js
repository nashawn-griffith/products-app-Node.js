if(process.env.NODE_ENV ==='production')
{
    const db = 'mongodb://nashawn:nashawn1234@ds135486.mlab.com:35486/product-app';

    module.exports = {
        mongoURI:db
    }

}
else
{
    const db = 'mongodb://localhost/product-app';
    module.exports = {
        mongoURI:db
    }
}


