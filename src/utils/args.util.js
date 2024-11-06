import {Command} from "commander";

const args = new Command;
args.option("-p <port>", "port", 5000 )
args.option("-m <mode>", "mode", "prod")

args.parse()

export default args.opts()
