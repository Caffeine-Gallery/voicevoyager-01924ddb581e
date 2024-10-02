import Hash "mo:base/Hash";

import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";

actor {
  type UserId = Principal;

  private let users = HashMap.HashMap<UserId, Text>(10, Principal.equal, Principal.hash);

  public shared(msg) func greet() : async Text {
    let userId = msg.caller;
    
    switch (users.get(userId)) {
      case (null) {
        let name = Principal.toText(userId);
        users.put(userId, name);
        return "Hello, new user: " # name # "! Welcome to the translation app.";
      };
      case (?name) {
        return "Welcome back, " # name # "!";
      };
    };
  };

  public shared query(msg) func whoami() : async Text {
    let userId = msg.caller;
    switch (users.get(userId)) {
      case (null) { "Not logged in" };
      case (?name) { name };
    };
  };
}
