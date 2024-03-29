const { Book, Reader, Author, Genre } = require('../models');

const getModel = model => {
  const models = {
    book: Book,
    reader: Reader,
    author: Author,
    genre: Genre,
  };

  return models[model];
}

const getError404 = model => {
  return { error: `The ${model} could not be found.` };
}

const getOptions = model => {
  if (model === 'book') return { include: [{ model: Genre}, {model: Author}] };

  if (model === 'genre') return { include: Book };

  if (model === 'author') return { include: Book };

  return {};
}

const removePasswordReturn = item => {
  if(item.dataValues.password) {
    delete item.dataValues.password;
  }
  return item;
}

exports.createItem = model => {
  const Model = getModel(model);
  return async (req, res) => {
    try {
      const newItem = await Model.create(req.body);
      removePasswordReturn(newItem);
      res.status(201).json(newItem);
    } catch (err) {
      const errorMessages = err.errors?.map((e) => e.message) // The ? in this statement is used for optional chaining i.e. if the errors property on the err object doesn't exist, it will return undefined instead of another error.
      res.status(400).json(errorMessages);
    }
  }
}

exports.getAllItems = model => {
  const Model = getModel(model);
  const options = getOptions(model);
  return async (_, res) => {
    const allItems = await Model.findAll({...options});
    allItems.forEach(item => removePasswordReturn(item));
    res.status(200).json(allItems);
  }
}

exports.getItemById = model => {
  const Model = getModel(model);
  const options = getOptions(model);
  return async (req, res) => {
    try {
      const { id }  = req.params;
  
      const item = await Model.findByPk(id, { ...options });
      if(!item) {
        res.status(404).json(getError404(model));
      }
      removePasswordReturn(item);
      res.status(200).json(item);
    } catch (err) {
      // res.status(500).json(err.message);
      console.log(err);
    }
  }
}

exports.updateItem = model => {
  const Model = getModel(model);
  return async (req, res) => {
    const { id: itemId } = req.params;
    const updateData = req.body;

    try {
      const [ updatedRows ] = await Model.update(updateData, { where: { id: itemId } });
      if(!updatedRows) {
        res.status(404).json(getError404(model));
      }
      res.status(200).json(updatedRows);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}

exports.deleteItem = model => {
  const Model = getModel(model);
  return async (req, res) => {
    const { id: itemId } = req.params;

    try {
      const deletedRows = await Model.destroy({ where: { id: itemId } });
      if(!deletedRows) {
        res.status(404).json(getError404(model));
      }
      res.status(204).json(deletedRows);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
}