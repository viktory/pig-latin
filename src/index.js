import transform from './PigTransformer/pigTransformer';

document.getElementById('transformBtn').onclick = () => {
  const strategy = document.querySelector('input[name="pigTransformOption"]:checked')
    ? document.querySelector('input[name="pigTransformOption"]:checked').value
    : undefined;
  document.getElementById('pigResult').innerText = transform(
    document.getElementById('originalText').value,
    strategy
  );
};
