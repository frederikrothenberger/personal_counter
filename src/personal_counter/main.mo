import Map "mo:base/HashMap";
import Principal "mo:base/Principal";

actor PersonalCounter {

    // map of counter values for all Principals
    private var counters = Map.HashMap<Principal, Nat>(10, Principal.equal, Principal.hash);

    // helper method to initialize missing values to 0
    private func getCount(principal: Principal) : Nat {
        let counter = counters.get(principal);
        switch counter {
            case (?counter){return counter};
            case _ {return 0};
        };
    };

    // Get the value of the counter.
    public query ({ caller }) func get() : async Nat {
        return getCount(caller);
    };

    // Increment the value of the counter.
    public shared({ caller }) func inc() : () {
        counters.put(caller, getCount(caller)+1)
    };
};
