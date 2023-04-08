<template>
  <h2>Simple æpp — Contract Instance</h2>
  <div class="group">
    <button @click="createPromise = create()">
      Create
    </button>
    <div v-if="createPromise">
      <div>Contract Instance</div>
      <Value :value="createPromise.then(() => 'Ready')" />
    </div>
  </div>

  <template v-if="createPromise">
    <h2>Compile Contract</h2>
    <div class="group">
      <button @click="compilePromise = compile()">
        Compile
      </button>
      <div v-if="compilePromise">
        <div>Bytecode</div>
        <Value :value="compilePromise" />
      </div>
    </div>
  </template>

  <template v-if="createPromise">
    <h2>Deploy Contract</h2>
    <div class="group">
      <div>
        <div>Deploy argument</div>
        <div>
          <input
            v-model="deployArg"
            placeholder="Deploy argument"
          >
        </div>
      </div>
      <button @click="deployPromise = deploy()">
        Deploy
      </button>
      <div v-if="deployPromise">
        <div>Deployed Contract</div>
        <Value :value="deployPromise" />
      </div>
    </div>
  </template>

  <template v-if="deployPromise">
    <h2>Call Contract</h2>
    <div class="group">
      <div>
        <div>Call argument</div>
        <div>
          <input
            v-model="callArg"
            placeholder="Call argument"
          >
        </div>
      </div>
      <button @click="callPromise = call()">
        Call
      </button>
      <div v-if="callPromise">
        <div>Call Result</div>
        <Value :value="callPromise" />
      </div>
    </div>
  </template>
</template>

<script>
import { AeSdk, MemoryAccount, Node } from '@aeternity/aepp-sdk';
import Contract from './Contract.aes';
import Value from './Value.vue';

export default {
  components: { Value },
  data: () => ({
    deployArg: 5,
    callArg: 7,
    createPromise: null,
    compilePromise: null,
    deployPromise: null,
    callPromise: null,
  }),
  mounted() {
    this.aeSdk = new AeSdk({
      nodes: [{ name: 'testnet', instance: new Node('https://testnet.aeternity.io') }],
      accounts: [
        new MemoryAccount('9ebd7beda0c79af72a42ece3821a56eff16359b6df376cf049aee995565f022f840c974b97164776454ba119d84edc4d6058a8dec92b6edc578ab2d30b4c4200'),
      ],
    });
  },
  methods: {
    create() {
      return Contract.initialize(this.aeSdk._getOptions());
    },
    async compile() {
      return (await this.createPromise).$compile();
    },
    async deploy() {
      return (await this.createPromise).$deploy([this.deployArg]);
    },
    async call() {
      return (await this.createPromise).calc(this.callArg);
    },
  },
};
</script>

<style lang="scss" src="./styles.scss" />
