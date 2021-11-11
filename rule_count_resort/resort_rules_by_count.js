const resortRulesByHitCount = (arr) => {
  const ret = [];
  const targetArr = [];
  for (let i = 0; i < arr.length; i++) {
    targetArr.push(arr[i]);
    if (arr[i].action === "deny" || i === arr.length - 1) {
      ret.push(...sortUpByManyHitCount(targetArr));
      targetArr.length = 0;
    }
  }
  return ret;
};

const sortUpByManyHitCount = (rules) => {
  for (let i = 0; i < rules.length; i++) {
    if (rules[i].action === "allow" && !isAllAny(rules[i])) {
      // Deny 변경 X
      for (let j = 0; j < rules.length; j++) {
        if (
          !isAllAny(rules[j]) &&
          rules[j].action !== "deny" &&
          rules[i].count > rules[j].count
        ) {
          // Deny 변경 X
          const temp = rules[i];
          rules[i] = rules[j];
          rules[j] = temp;
        }
      }
    }
  }
  return rules;
};

const isAllAny = ({ source, destination, service }) => {
  if (
    source.includes("any") &&
    destination.includes("any") &&
    service.includes("any")
  ) {
    return true;
  }
  return false;
};

const result = resortRulesByHitCount(RULES);
console.log(result);
document.getElementById("result").innerHTML = result
  .map((rule) => JSON.stringify(rule))
  .join("<br>");
