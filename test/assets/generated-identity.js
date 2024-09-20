import { Contract } from '@aeternity/aepp-sdk';

const compiledContractOptions = {
  "bytecode": "cb_+GhGA6CnrCop0WHBS6ooHIsqMquYst202kMxRdF/vwCxqAv6rMC4O57+RNZEHwA3ADcAGg6CPwEDP/6AeCCSADcBBwcBAQCYLwIRRNZEHxFpbml0EYB4IJIZZ2V0QXJngi8AhTcuMS4wAP24uo4=",
  "aci": [
    {
      "contract": {
        "functions": [
          {
            "arguments": [
              {
                "name": "x",
                "type": "int"
              }
            ],
            "name": "getArg",
            "payable": false,
            "returns": "int",
            "stateful": false
          }
        ],
        "kind": "contract_main",
        "name": "Identity",
        "payable": false,
        "typedefs": []
      }
    }
  ]
};

export default class IdentityContract extends Contract {
  constructor(options) {
    super({ ...options, ...compiledContractOptions });
  }

  static async initialize(options) {
    return Contract.initialize({ ...options, ...compiledContractOptions });
  }
}
