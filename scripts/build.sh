echo "2) Building all projects"
for line in $(find . -name "package.json" -not -path "*/node_modules/*"); do 
    a=$PWD; 
    echo "Installing modules in $(dirname $line)"; 
    cd $(dirname $line); 
    npm run build; 
    cd $a; 
done
