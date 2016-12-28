function create_base_sequence(items, reps) {
  var base_items = [];
  for (var i = 0; i < items; i++) {
    base_items.push(i);
  }

  var seq = [];
  seq = seq.concat(jsPsych.randomization.shuffle(base_items));
  for (var i = 1; i < reps; i++) {
    var to_add = jsPsych.randomization.shuffle(base_items);
    while (to_add[0] == seq[seq.length - 1]) {
      to_add = jsPsych.randomization.shuffle(base_items);
    }
    seq = seq.concat(to_add);
  }
  return seq;
}

function create_sequence(triples, reps) {

  var base_seq = create_base_sequence(triples.length, reps);

  var seq = [];
  for (var i in base_seq) {
    seq = seq.concat(triples[base_seq[i]]);
  }

  return seq;

}

function create_scrambled_sequence(triples, reps) {
  var base_seq = create_base_sequence(triples.length, reps);

  var seq = [];
  for (var i in base_seq) {
    if (base_seq[i] != 0) {
      var toadd = jsPsych.randomization.shuffle(triples[base_seq[i]].slice(0));
      while(JSON.stringify(toadd) == JSON.stringify(triples[base_seq[i]])){
        toadd = jsPsych.randomization.shuffle(triples[base_seq[i]].slice(0));
      }
      seq = seq.concat(toadd);
    } else {
      seq = seq.concat(triples[base_seq[i]]);
    }
  }
  return seq;
}

function reverse_array(arr) {
  var out = [];
  for (var i = arr.length - 1; i >= 0; i--) {
    out.push(arr[i]);
  }
  return out;
}

function get_all_orders(arr) {
  var o = arr.slice(0);
  var orders = permutator(arr);
  orders = jsPsych.randomization.shuffle(orders);

  for (var i = 0; i < orders.length; i++) {
    if (JSON.stringify(orders[i]) == JSON.stringify(o)) {
      var correct_order = i;
    }
  }

  return {
    permutations: orders,
    correct_order: correct_order
  }
}

function make_test_stimulus(orders) {
  var stim = "<div class='test'><p>Pick the order that these letters appeared " +
    "in during the sequence. Press the number key of your choice.</p>";
  for (var i = 0; i < orders.length; i++) {
    var j = i + 1;
    stim += "<p>(" + j + ") " + orders[i][0] + orders[i][1] + orders[i][2] + "</p>"
  }
  stim += "</div>"
  return stim;
}

function permutator(inputArr) {
  var results = [];

  function permute(arr, memo) {
    var cur, memo = memo || [];

    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }

    return results;
  }

  return permute(inputArr);
}
