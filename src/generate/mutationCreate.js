/**
 * Generates a create mutation operation
 *
 * @param {*} modelName
 * @param {*} inputType
 * @param {*} outputType
 * @param {*} model
 */
module.exports = (
  modelName,
  inputType,
  outputType,
  model,
  graphqlModelDeclaration
) => ({
  type: outputType, // what is returned by resolve, must be of type GraphQLObjectType
  description: 'Create a ' + modelName,
  args: Object.assign(
    {
      [modelName]: { type: inputType }
    },
    graphqlModelDeclaration.create && graphqlModelDeclaration.create.extraArg
      ? graphqlModelDeclaration.create.extraArg
      : {}
  ),
  resolve: async (source, args, context, info) => {
    let object = args[modelName]
    if (
      graphqlModelDeclaration.create &&
      graphqlModelDeclaration.create.before
    ) {
      object = await graphqlModelDeclaration.create.before(
        source,
        args,
        context,
        info
      )
    }
    const newObject = await model.create(object)

    if (
      graphqlModelDeclaration.create &&
      graphqlModelDeclaration.create.after
    ) {
      return graphqlModelDeclaration.create.after(
        newObject,
        source,
        args,
        context,
        info
      )
    }
    return newObject
  }
})