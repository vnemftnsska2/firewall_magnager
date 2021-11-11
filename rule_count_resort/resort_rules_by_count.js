const resortRulesByHitCount = (arr) => {
  const ret = [];
  const targetArr = [];
  for (let i = 0; i < arr.length; i++) {
    // for (let i = 6; i < 14; i++) {
    targetArr.push(arr[i]);
    if (arr[i].action === "deny" || i === arr.length - 1) {
      ret.push(...sortUpByManyHitCount(targetArr));
      targetArr.length = 0;
    }
  }
  return ret;
};

const sortUpByManyHitCount = (rules) => {
  let i = 0;
  while (i < rules.length) {
    let isFind = false;
    if (rules[i].action === "allow" && !isAllAny(rules[i])) {
      for (let j = i + 1; j < rules.length; j++) {
        if (
          !isAllAny(rules[j]) &&
          rules[j].action !== "deny" &&
          rules[i].count < rules[j].count
        ) {
          const temp = rules[j];
          rules.splice(j, 1);
          rules.unshift(temp);
          isFind = true;
        }
      }
    }

    if (isFind) {
      i = 0;
    } else if (!isFind) {
      i++;
    }
  }
  return rules;
};

// 잘못된 컨셉 (섞는 게 아님 -> 한칸씩 밀리도록)
const sortUpByManyHitCount_old_ver = (rules) => {
  for (let i = 0; i < rules.length; i++) {
    if (rules[i].action === "allow" && !isAllAny(rules[i])) {
      // Deny 변경 X
      for (let j = 0; j < rules.length; j++) {
        if (
          !isAllAny(rules[j]) &&
          rules[j].action !== "deny" &&
          rules[i].count < rules[j].count
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
  .map((rule) =>
    rule.action === "deny"
      ? `<font color="red">${JSON.stringify(rule)}</font>`
      : JSON.stringify(rule)
  )
  .join("<br>");
