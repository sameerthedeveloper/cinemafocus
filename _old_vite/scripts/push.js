import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const runCommand = (command) => {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Error executing: ${command}`);
        process.exit(1);
    }
};

const pushChanges = (message) => {
    console.log('\n📦 Staging changes...');
    runCommand('git add .');

    console.log('💾 Committing...');
    runCommand(`git commit -m "${message}"`);

    console.log('🚀 Pushing to remote...');
    runCommand('git push');

    console.log('\n✅ Done!');
};

const args = process.argv.slice(2);

if (args.length > 0) {
    pushChanges(args.join(' '));
    process.exit(0);
} else {
    rl.question('📝 Enter commit message: ', (answer) => {
        if (!answer.trim()) {
            console.log('❌ Commit message cannot be empty.');
            process.exit(1);
        }
        pushChanges(answer);
        rl.close();
    });
}
