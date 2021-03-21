const uuidv4Regex = '[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}';

module.exports = function uuidPartitionPattern(partition){
    return new RegExp(partition+':' + uuidv4Regex, 'i');
}