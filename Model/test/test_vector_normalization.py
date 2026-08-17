import torch
import torch.nn.functional as F


def test_ut_ai_01_vector_l2_normalization():
    vector = torch.tensor([[3.0, 4.0]])

    normalized_vector = F.normalize(
        vector,
        p=2,
        dim=-1
    )

    norm = torch.linalg.norm(
        normalized_vector,
        ord=2
    )

    assert torch.isclose(
        norm,
        torch.tensor(1.0),
        atol=1e-6
    )