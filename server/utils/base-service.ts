export default abstract class BaseService {
  protected abstract model
  
  public find = () => {
    return this.model.find()
  }
  
  public findById = (id: string) => {
    return this.model.findById(id)
  }
  
  public create = (doc) => {
    return this.model.create(doc)
  }
  
  public findByIdAndDelete = (id: string) => {
    return this.model.findByIdAndDelete(id)
  }
  
  public exists = (id: string) => {
    return this.model.exists({ _id: id })
  }
}
