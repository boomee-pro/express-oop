import OAuth2Strategy from "passport-oauth2";

export default abstract class Strategy {
  constructor(public name: string, public strategy: OAuth2Strategy) {
    this.name = name;
    this.strategy = strategy;
  }
}
