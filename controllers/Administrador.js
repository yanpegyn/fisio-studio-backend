module.exports.login = async (req, res) => {
  const { nome_de_usuario, senha } = req.body;
  const where = { nome_de_usuario };

  const adm = await global.sequelize.models.Administrador.findOne({ where });
  if (!adm) return res.status(400).send({ message: 'Usuário ou senha incorreto' });

  const passwordIsOk = await adm.efetuaLogin(senha);
  if (!passwordIsOk) return res.status(400).send({ message: 'Usuário ou senha incorreto' });

  const data = { ...adm.dataValues };
  delete data.senha;

  res.send( { message: 'Login efetuado', dados: data });
}