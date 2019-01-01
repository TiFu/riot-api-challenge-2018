set -e
echo "1) Installing npm modules in all directories!"
for line in $(find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/helper-scripts/*" -not -path "*/.vscode/*"); do 
    a=$PWD; 
    echo "Installing modules in $(dirname $line)"; 
    cd $(dirname $line); 
    npm install; 
    cd $a; 
done

